/**
 * BasaBondhu OpenRouter Client with Robust Key Rotation
 */

const getApiKeys = (): string[] => {
  const envKeys = process.env.OPENROUTER_API_KEYS;
  if (!envKeys) {
    throw new Error(
      "OPENROUTER_API_KEYS environment variable is not set. " +
      "Add your comma-separated API keys to .env.local"
    );
  }
  return envKeys.split(",").map(k => k.trim()).filter(Boolean);
};

export async function callOpenRouter(prompt: string, jsonMode: boolean = false): Promise<string> {
  const keys = getApiKeys();
  let lastError = null;

  for (const key of keys) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
          "HTTP-Referer": "https://bashabondhu.com",
          "X-Title": "BasaBondhu AI Search Refinement"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: jsonMode 
                ? "You are an agentic AI assistant for property matches. You must return only valid JSON." 
                : "You are an agentic AI assistant."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return content;
      }
      throw new Error("Empty response choice from OpenRouter");
    } catch (error) {
      console.warn(`API key failed: ${key.substring(0, 15)}... Error:`, error);
      lastError = error;
    }
  }

  throw new Error(`All OpenRouter API keys failed. Last error: ${lastError?.toString()}`);
}
