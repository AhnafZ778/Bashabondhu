import { NextResponse } from "next/server";
import { getAllListings } from "@/lib/repositories/listing.repository";
import { scoreListing } from "@/lib/scoring";
import { callOpenRouter } from "@/lib/services/openrouter.service";
import { Verdict } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { profile, answers, additionalQuery } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Missing renter profile" }, { status: 400 });
    }

    const allListings = getAllListings();

    // 1. First score them locally using the standard scoring engine
    const initialScored = allListings.map(listing => 
      scoreListing(listing, profile, [])
    );

    // 2. Prepare the prompt for OpenRouter to run the Agentic refinement
    const prompt = `
You are BasaBondhu's Agentic AI Renter Matcher.
We have a user with a search profile, additional MCQ answers, and optional custom constraints.
We want you to evaluate each listing against their specific lifestyle and needs.

RENTER SEARCH PROFILE:
- Household Type: ${profile.householdType}
- Monthly Budget: ৳${profile.budgetMonthly}
- Max First Month Cash: ৳${profile.maxFirstMonthCash}
- Commute Anchors: ${JSON.stringify(profile.commuteAnchors)}
- Priorities: ${JSON.stringify(profile.priorities)}

MCQ LIFESTYLE ANSWERS:
${Object.entries(answers || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

ADDITIONAL NATURAL LANGUAGE CONSTRAINTS:
${additionalQuery || "None"}

LISTINGS TO EVALUATE:
${JSON.stringify(allListings.map(l => ({
  id: l.id,
  title: l.title,
  area: l.area,
  rent: l.rent,
  advanceMonths: l.advanceMonths,
  serviceCharge: l.serviceCharge,
  bedrooms: l.bedrooms,
  bathrooms: l.bathrooms,
  facing: l.facing,
  parkingAvailable: l.parkingAvailable,
  tenantPreference: l.tenantPreference,
  gasType: l.gasType,
  lift: l.lift,
  generator: l.generator,
  waterloggingRisk: l.waterloggingRisk,
  distanceToHospitalMins: l.distanceToHospitalMins,
  distanceToMarketMins: l.distanceToMarketMins,
  rawText: l.rawText
})))}

Evaluate each listing and output ONLY a JSON object mapping listing IDs to their match analysis.
The output format must be EXACTLY:
{
  "listings": {
    "listing_id_here": {
      "score": number (0 to 100),
      "verdict": "visit" | "maybe" | "call-first" | "avoid",
      "whyItFits": "string - explain why this flat fits their job, marital status, children/schools, vehicles, and lifestyle in 1-2 sentences.",
      "biggestRisk": "string - explain the biggest drawback/concern for them (e.g. no lift for senior citizens, cylinder gas, far from hospital, waterlogging) in 1 sentence.",
      "questionsToAsk": [
        "string - question 1 to ask the landlord based on their specific concerns",
        "string - question 2 to ask the landlord based on their specific concerns"
      ]
    }
  }
}
Do not add any markdown formatting, thoughts, or explanations around the JSON.
`;

    let aiResult: any = null;
    try {
      const responseText = await callOpenRouter(prompt, true);
      
      // Clean up markdown block wraps if model included them
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      }
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();

      const parsed = JSON.parse(cleanedText);
      if (parsed && parsed.listings) {
        aiResult = parsed.listings;
      }
    } catch (apiError) {
      console.error("OpenRouter refinement failed, falling back to local scoring adjustments:", apiError);
      // Fallback is handled below
    }

    // 3. Apply AI scores & reasons, or run fallback rule-based matching if AI failed
    const refinedListings = initialScored.map(scored => {
      const aiData = aiResult ? aiResult[scored.id] : null;

      if (aiData) {
        let mappedVerdict: Verdict = "maybe";
        if (aiData.verdict === "visit" || aiData.verdict === "strong" || aiData.verdict === "strong_match") {
          mappedVerdict = "visit";
        } else if (aiData.verdict === "maybe" || aiData.verdict === "good" || aiData.verdict === "good_match") {
          mappedVerdict = "maybe";
        } else if (aiData.verdict === "call-first") {
          mappedVerdict = "call-first";
        } else if (aiData.verdict === "avoid") {
          mappedVerdict = "avoid";
        }

        // Use real AI calculations
        return {
          ...scored,
          scores: {
            ...scored.scores,
            total: aiData.score
          },
          verdict: mappedVerdict,
          whyItFits: aiData.whyItFits,
          biggestRisk: aiData.biggestRisk,
          questionsToAsk: aiData.questionsToAsk || scored.questionsToAsk
        };
      } else {
        // Rule-based Agentic fallback simulation
        let scoreAdjust = 0;
        let reasons: string[] = [];
        let risk = "";
        let questions: string[] = [];

        // Check parking
        if (answers.parkingSpaces && answers.parkingSpaces !== "No parking needed") {
          if (!scored.parkingAvailable) {
            scoreAdjust -= 25;
            risk = "This listing has no parking spaces available, but you need them.";
            questions.push("Is there any private garage space available for rent nearby?");
          } else {
            reasons.push("Includes parking space matching your vehicle request.");
          }
        }

        // Check facing
        if (answers.houseFacing && answers.houseFacing !== "No Preference") {
          const expected = answers.houseFacing.toLowerCase();
          if (scored.facing && expected.includes(scored.facing.toLowerCase())) {
            scoreAdjust += 10;
            reasons.push(`Matches your preferred ${scored.facing} facing expectation.`);
          }
        }

        // Check hospital
        if (answers.hospitalNeed === "Yes, critical") {
          if (scored.distanceToHospitalMins && scored.distanceToHospitalMins > 15) {
            scoreAdjust -= 15;
            risk = `Hospital is ${scored.distanceToHospitalMins} mins away, which exceeds your critical limit.`;
            questions.push("How fast can an ambulance access the building during traffic peaks?");
          }
        }

        const finalScore = Math.max(0, Math.min(100, scored.scores.total + scoreAdjust));
        let finalVerdict: Verdict = scored.verdict;
        if (finalScore >= 80) finalVerdict = "visit";
        else if (finalScore >= 55) finalVerdict = "maybe";
        else finalVerdict = "avoid";

        return {
          ...scored,
          scores: {
            ...scored.scores,
            total: finalScore
          },
          verdict: finalVerdict,
          whyItFits: reasons.join(" ") || `Decent listing in ${scored.area} matching your profile budget.`,
          biggestRisk: risk || scored.biggestRisk || "None identified.",
          questionsToAsk: questions.length > 0 ? questions : scored.questionsToAsk
        };
      }
    });

    // Sort by total score descending, put "avoid" at the bottom
    refinedListings.sort((a, b) => {
      if (a.verdict === "avoid" && b.verdict !== "avoid") return 1;
      if (a.verdict !== "avoid" && b.verdict === "avoid") return -1;
      return b.scores.total - a.scores.total;
    });

    return NextResponse.json({
      ok: true,
      listings: refinedListings
    });
  } catch (err: any) {
    console.error("POST /api/search/refine handler error:", err);
    return NextResponse.json({ ok: false, error: err?.toString() }, { status: 500 });
  }
}
