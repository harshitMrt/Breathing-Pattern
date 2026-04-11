// api/recommend.js  — Vercel serverless function
// Place this file at:  /api/recommend.js  (project root, NOT inside src/)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  try {
    const { needs, experience, duration, additionalContext } = req.body;

    const prompt = `You are a breathwork expert. Design a personalised breathing exercise level.

User needs: ${(needs || []).join(", ")}
Experience level: ${experience || "beginner"}
Preferred session duration: ${duration || "medium"}
Additional context: ${additionalContext || "None"}

Respond with ONLY a valid JSON object. No markdown fences, no explanation, no extra text.
Exactly this shape:
{
  "name": "Short descriptive name (max 5 words)",
  "technique": "Technique name e.g. Box Breathing",
  "inn": 4,
  "hold": 4,
  "out": 4,
  "hold2": 0,
  "note": "One sentence explaining why this suits the user"
}

Rules:
- inn: integer 2-8
- hold: integer 0-8
- out: integer 2-10
- hold2: integer 0-4`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return res.status(anthropicRes.status).json({ error: errText });
    }

    const data = await anthropicRes.json();
    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    // Ensure required fields with safe defaults
    const result = {
      name: parsed.name || "Custom Breathing",
      technique: parsed.technique || "Custom",
      inn: Number(parsed.inn) || 4,
      hold: Number(parsed.hold) || 0,
      out: Number(parsed.out) || 4,
      hold2: Number(parsed.hold2) || 0,
      note: parsed.note || "",
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error("Recommend API error:", err);
    return res.status(500).json({ error: "Failed to generate recommendation" });
  }
}
