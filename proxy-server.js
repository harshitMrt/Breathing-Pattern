// proxy-server.js
// Run with: node proxy-server.js
const express = require("express");
const cors = require("cors");
const https = require("https"); // ← built into Node, no extra install needed
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

/* ── helper: call Anthropic using Node's built-in https module ── */
function callAnthropic(apiKey, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);

    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          reject(new Error("Failed to parse Anthropic response"));
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/* ── POST /api/recommend ── */
app.post("/api/recommend", async (req, res) => {
  const key = process.env.REACT_APP_ANTHROPIC_KEY;

  if (!key || key === "YOUR_ANTHROPIC_API_KEY") {
    return res
      .status(500)
      .json({ error: "REACT_APP_ANTHROPIC_KEY not set in .env" });
  }

  const {
    needs = [],
    experience = "beginner",
    duration = "medium",
    additionalContext = "",
  } = req.body;

  const NEED_LABELS = {
    stress: "Reduce Stress",
    sleep: "Better Sleep",
    focus: "Improve Focus",
    energy: "Boost Energy",
    anxiety: "Calm Anxiety",
    balance: "Emotional Balance",
    performance: "Athletic Performance",
    panic: "Panic Relief",
  };

  const needLabels = needs.map((id) => NEED_LABELS[id] ?? id).join(", ");

  const SYSTEM_PROMPT = `You are an expert breathwork coach and therapist.
Your job is to design a personalized breathing exercise level for a user based on their needs.

You MUST respond with ONLY a valid JSON object, no markdown, no explanation, nothing else.

The JSON must follow this exact schema:
{
  "name": "string — creative name for this level (max 30 chars)",
  "inn": number — inhale duration in seconds (2-8),
  "hold": number — hold after inhale in seconds (0-8),
  "out": number — exhale duration in seconds (2-10),
  "hold2": number — hold after exhale in seconds (0-4),
  "note": "string — a 1-sentence motivational tip (max 100 chars)",
  "technique": "string — name of the breathing technique (e.g. Box Breathing, 4-7-8)"
}

Rules:
- Exhale longer than inhale for relaxation goals
- Inhale longer than exhale for energy goals
- Beginner: keep values low. Advanced: use longer holds and ratios
- hold2 is optional, set to 0 if not needed
- Always name the technique`;

  const userMessage = `Design a breathing level for me:
Goals: ${needLabels}
Experience: ${experience}
Duration: ${duration}
${additionalContext ? `Extra context: ${additionalContext}` : ""}`;

  try {
    const { status, body } = await callAnthropic(key, {
      model: "claude-opus-4-5",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    if (status !== 200) {
      console.error("Anthropic error:", body);
      return res
        .status(status)
        .json({ error: body?.error?.message ?? "Anthropic API error" });
    }

    const text = body.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error("Bad JSON from Claude:", text);
      return res
        .status(500)
        .json({ error: "AI returned invalid JSON. Please try again." });
    }

    return res.json({
      name: String(parsed.name ?? "AI Level").slice(0, 30),
      inn: Math.min(8, Math.max(2, Number(parsed.inn) || 4)),
      hold: Math.min(8, Math.max(0, Number(parsed.hold) || 0)),
      out: Math.min(10, Math.max(2, Number(parsed.out) || 4)),
      hold2: Math.min(4, Math.max(0, Number(parsed.hold2) || 0)),
      note: String(parsed.note ?? "").slice(0, 100),
      technique: String(parsed.technique ?? "Custom"),
    });
  } catch (e) {
    console.error("Proxy error:", e.message);
    return res.status(500).json({ error: e.message });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`\n✅  Proxy running at http://localhost:${PORT}`);
  console.log(`    POST http://localhost:${PORT}/api/recommend\n`);
});
