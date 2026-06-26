import { NextRequest, NextResponse } from "next/server";

// Simple HTML Entity Decoder
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\\n/g, "\n") // Decode literal \n sequences if present
    .replace(/\\r/g, "\r");
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Attempt to fetch the Facebook post page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 60 }, // Cache response for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Facebook page. Status: ${response.status}`);
    }

    const html = await response.text();

    // Regex patterns to extract caption from meta description tags
    const patterns = [
      /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i,
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
      /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i,
      /<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i,
      /<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i,
    ];

    let extractedText = "";

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const decoded = decodeHtmlEntities(match[1].trim());
        // Clean up trailing ellipsis or "See more" if facebook truncated it
        const cleaned = decoded
          .replace(/\.\.\.\s*$/, "")
          .replace(/\s+See more\s*$/i, "")
          .trim();
        
        if (cleaned && cleaned.length > extractedText.length) {
          extractedText = cleaned;
        }
      }
    }

    // Fallback: If no meta description matched, check if there is a json config with title containing property details
    if (!extractedText) {
      const jsonTitleMatch = html.match(/"title"\s*:\s*"([^"]+)"/i);
      if (jsonTitleMatch && jsonTitleMatch[1]) {
        const decoded = decodeHtmlEntities(jsonTitleMatch[1].trim());
        if (decoded.includes("TO-LET") || decoded.toLowerCase().includes("rent") || decoded.toLowerCase().includes("flat")) {
          // Remove potential author prefix e.g. "Sakib Khandaker - TO-LET..."
          const cleanedTitle = decoded
            .replace(/^[^-]+-\s*/, "")
            .replace(/\.\.\.\s*$/, "")
            .trim();
          extractedText = cleanedTitle;
        }
      }
    }

    if (!extractedText) {
      return NextResponse.json({
        ok: false,
        error: "Could not find listing caption in the page metadata.",
        fallback: true
      });
    }

    return NextResponse.json({
      ok: true,
      text: extractedText,
    });

  } catch (error) {
    console.error("Facebook fetcher API error:", error);
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Failed to crawl Facebook post",
      fallback: true
    });
  }
}
