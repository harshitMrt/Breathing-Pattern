// src/services/aiRecommendation.js
// Uses Groq API (free) instead of Anthropic

const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || "";

export const NEED_OPTIONS = [
  { id: "stress", label: "Reduce Stress", emoji: "😮‍💨" },
  { id: "sleep", label: "Better Sleep", emoji: "😴" },
  { id: "focus", label: "Improve Focus", emoji: "🎯" },
  { id: "anxiety", label: "Calm Anxiety", emoji: "🫀" },
  { id: "energy", label: "Boost Energy", emoji: "⚡" },
  { id: "anger", label: "Manage Anger", emoji: "🌊" },
  { id: "performance", label: "Athletic Performance", emoji: "🏃" },
  { id: "panic", label: "Panic Relief", emoji: "🧘" },
];

export const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const SESSION_DURATIONS = [
  { id: "short", label: "2–5 min", minutes: 3 },
  { id: "medium", label: "5–10 min", minutes: 7 },
  { id: "long", label: "10–20 min", minutes: 15 },
];

const SYSTEM_PROMPT = `You are an expert breathwork coach and therapist.
Your job is to design a personalized breathing exercise level for a user based on their needs.

You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no extra text — just raw JSON.

The JSON must follow this exact schema:
{
  "name": "string — creative name for this level (max 30 chars)",
  "inn": number — inhale duration in seconds (2–8),
  "hold": number — hold after inhale in seconds (0–8),
  "out": number — exhale duration in seconds (2–10),
  "hold2": number — hold after exhale in seconds (0–4),
  "note": "string — a 1-sentence motivational tip for the user (max 100 chars)",
  "technique": "string — name of the breathing technique (e.g. Box Breathing, 4-7-8)"
}

Rules:
- Exhale longer than inhale for relaxation/sleep goals
- Inhale longer than exhale for energy goals
- For beginners keep all values low
- For advanced users use longer holds and ratios
- hold2 is optional — set to 0 if not needed
- Always name the technique you are using`;

export const getAIRecommendation = async ({
  needs,
  experience,
  duration,
  additionalContext = "",
}) => {
  if (!GROQ_KEY) throw new Error("Groq API key not set. Check your .env file.");

  const needLabels = needs
    .map((id) => NEED_OPTIONS.find((n) => n.id === id)?.label ?? id)
    .join(", ");

  const durationInfo = SESSION_DURATIONS.find((d) => d.id === duration);

  const userMessage = `Please design a breathing level for me:

Goals: ${needLabels}
Experience level: ${experience}
Preferred session duration: ${durationInfo?.label ?? duration}
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Respond with ONLY the JSON object, nothing else.`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message ?? `Groq API error (${response.status})`,
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  // Validate & clamp
  return {
    name: String(parsed.name ?? "AI Level").slice(0, 30),
    inn: Math.min(8, Math.max(2, Number(parsed.inn) || 4)),
    hold: Math.min(8, Math.max(0, Number(parsed.hold) || 0)),
    out: Math.min(10, Math.max(2, Number(parsed.out) || 4)),
    hold2: Math.min(4, Math.max(0, Number(parsed.hold2) || 0)),
    note: String(parsed.note ?? "").slice(0, 100),
    technique: String(parsed.technique ?? "Custom"),
  };
};
