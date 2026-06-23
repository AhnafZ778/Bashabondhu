import { ChecklistSection, SearchProfile } from "../types";

/**
 * Checklist Service
 * Generates visit preparation checklists adapted to user type.
 */

export function generateVisitChecklist(
  profile: SearchProfile
): ChecklistSection[] {
  const sections: ChecklistSection[] = [];

  // Universal checks
  sections.push({
    category: "🔑 Before You Leave",
    items: [
      { label: "Call landlord to confirm visit time", description: "Verify they'll be available when you arrive", checked: false },
      { label: "Bring NID copy and job ID/student ID", description: "Most landlords ask for identity proof on first visit", checked: false },
      { label: "Carry notebook or phone to note issues", description: "Document any red flags during the visit", checked: false },
      { label: "Check the route on Google Maps", description: "Know how to get there and how long it takes", checked: false },
    ]
  });

  // Building & flat inspection
  sections.push({
    category: "🏠 Building Inspection",
    items: [
      { label: "Check staircase and hallway condition", description: "Dark corridors or broken stairs indicate poor maintenance", checked: false },
      { label: "Test lift operation", description: "Press multiple floors — does it work smoothly?", checked: false },
      { label: "Ask about generator backup schedule", description: "How many hours does it run during load shedding?", checked: false },
      { label: "Check water pressure in bathroom", description: "Turn on taps and flush — is pressure consistent?", checked: false },
      { label: "Inspect gas connection", description: "Is it Titas line or cylinder? Check stove ignition", checked: false },
      { label: "Look at electrical wiring", description: "Exposed or old wiring is a fire and safety risk", checked: false },
    ]
  });

  // Cost verification
  sections.push({
    category: "💰 Cost Verification",
    items: [
      { label: "Confirm exact monthly rent", description: "Is it the same as advertised? Any upcoming increases?", checked: false },
      { label: "Confirm service charge amount", description: "What does it cover? Is it fixed or variable?", checked: false },
      { label: "Ask about utility payment process", description: "Are electricity and water bills separate? Who collects?", checked: false },
      { label: "Clarify advance/security deposit terms", description: "Is it refundable? What conditions for return?", checked: false },
      { label: "Ask about broker fee if applicable", description: "How much and when is it paid?", checked: false },
    ]
  });

  // Household-specific checks
  if (profile.householdType === "family" || profile.householdType === "couple") {
    sections.push({
      category: "👨‍👩‍👧 Family-Specific Checks",
      items: [
        { label: "Check neighborhood safety after dark", description: "Walk around the block — are streets well-lit?", checked: false },
        { label: "Ask about other families in the building", description: "Family-dominated buildings tend to be quieter", checked: false },
        { label: "Check proximity to schools and hospitals", description: "How far are the nearest options?", checked: false },
        { label: "Inspect children's play area", description: "Is there a rooftop or courtyard for kids?", checked: false },
        { label: "Check noise levels from street", description: "Open windows and listen — is it bearable?", checked: false },
      ]
    });
  }

  if (profile.householdType === "bachelor" || profile.householdType === "student") {
    sections.push({
      category: "🎓 Bachelor/Student Checks",
      items: [
        { label: "Confirm bachelor entry rules", description: "Any guest restrictions or curfew times?", checked: false },
        { label: "Check wifi availability", description: "Is broadband available? What speed and provider?", checked: false },
        { label: "Ask about cooking allowance", description: "Can you cook in the room/kitchen? Any restrictions?", checked: false },
        { label: "Check nearby food options", description: "Are there affordable restaurants and tea stalls nearby?", checked: false },
        { label: "Verify public transport access", description: "How far is the nearest bus stop or rickshaw stand?", checked: false },
      ]
    });
  }

  if (profile.householdType === "working-woman") {
    sections.push({
      category: "👩‍💼 Women's Safety Checks",
      items: [
        { label: "Check main gate security", description: "Is there a guard? Does the gate lock at night?", checked: false },
        { label: "Verify late-night entry access", description: "Can you enter after 10 PM? Is there a separate key?", checked: false },
        { label: "Check CCTV coverage", description: "Are there cameras in common areas?", checked: false },
        { label: "Meet other female residents if possible", description: "Ask about their experience living here", checked: false },
        { label: "Check auto-rickshaw/ride availability", description: "Is it easy to get transport late at night?", checked: false },
      ]
    });
  }

  // Waterlogging check if relevant
  if (profile.dealBreakers.includes("heavy-waterlogging") || profile.priorities.includes("no-waterlogging")) {
    sections.push({
      category: "🌧️ Waterlogging Check",
      items: [
        { label: "Ask neighbors about monsoon flooding", description: "Does the road flood during heavy rain?", checked: false },
        { label: "Check ground floor elevation", description: "Is the building raised above road level?", checked: false },
        { label: "Look for water stain marks on walls", description: "Signs of past flooding or dampness", checked: false },
      ]
    });
  }

  // Final document section
  sections.push({
    category: "📋 Before Signing",
    items: [
      { label: "Read the rental agreement carefully", description: "Check notice period, renewal terms, and penalty clauses", checked: false },
      { label: "Take photos of the flat condition", description: "Document existing damage before move-in for deposit protection", checked: false },
      { label: "Get landlord's NID and ownership proof", description: "Verify they actually own the property", checked: false },
      { label: "Confirm move-in date and key handover", description: "When exactly can you move in?", checked: false },
    ]
  });

  return sections;
}
