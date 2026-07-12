// Purpose: Single endpoint — receive chat messages, call Groq, return
// structured response. Does NOT save transactions (frontend handles that
// using existing APIs). Clean separation of concerns.

const Groq = require("groq-sdk");
const { buildSystemPrompt } = require("../utils/aiPromptBuilder");

// Lazy-initialize the Groq client — prevents crash on import if key is missing
let groq = null;
const getGroqClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

// ─── Constants ───────────────────────────────────────────────────────────────
const MODEL = "llama-3.1-8b-instant";
const MAX_USER_MESSAGE_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 10; // Keep context window small = fewer tokens
const VALID_CONTEXTS = ["income", "expense", "dashboard"];
const VALID_ROLES = ["user", "assistant"];

// ─── Utility: extract JSON from Groq response ────────────────────────────────
// Tries ```json block first, falls back to raw object scan.
// Returns null on any parse failure — never throws.
const extractJSON = (text) => {
  // Try fenced code block first (most reliable)
  const blockMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (blockMatch) {
    try { return JSON.parse(blockMatch[1]); } catch { /* fall through */ }
  }
  // Fallback: find the outermost { } pair
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try { return JSON.parse(objectMatch[0]); } catch { /* fall through */ }
  }
  return null;
};

// ─── Utility: extract human message from Groq response ───────────────────────
const extractHumanMessage = (text) =>
  text.replace(/```json\s*[\s\S]*?\s*```/gi, "").trim();

// ─── Controller ──────────────────────────────────────────────────────────────
exports.chat = async (req, res) => {
  // 1. Validate required fields
  const { messages, pageContext, currentDate } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "messages array is required." });
  }

  if (!VALID_CONTEXTS.includes(pageContext)) {
    return res.status(400).json({ message: "Invalid pageContext." });
  }

  if (!currentDate || typeof currentDate !== "string") {
    return res.status(400).json({ message: "currentDate is required." });
  }

  // 2. Sanitize and limit conversation history
  // - Only allow known roles (prevents prompt injection via role spoofing)
  // - Trim and cap each message to prevent token abuse
  // - Keep only the last MAX_HISTORY_MESSAGES turns
  const sanitizedMessages = messages
    .filter((m) => VALID_ROLES.includes(m?.role) && typeof m?.content === "string")
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_USER_MESSAGE_LENGTH),
    }));

  if (sanitizedMessages.length === 0) {
    return res.status(400).json({ message: "No valid messages provided." });
  }

  // 3. Build system prompt with runtime context
  const systemPrompt = buildSystemPrompt(pageContext, currentDate);

  // 4. Call Groq API
  try {
    const client = getGroqClient();

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedMessages,
      ],
      temperature: 0.2,  // Low = deterministic JSON; higher = more creative but risky
      max_tokens: 600,
      stream: false,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";

    // 5. Parse structured data from response
    const parsedData = extractJSON(rawContent);
    const humanMessage = extractHumanMessage(rawContent);

    // 6. Respond — even if JSON parse failed, we return the human message
    // so the frontend can still show something useful
    return res.status(200).json({
      message: humanMessage || "Could you try rephrasing that?",
      parsedData,         // null if parsing failed — frontend handles gracefully
    });
  } catch (error) {
    // Distinguish Groq API errors from unexpected errors
    // Never expose raw error details to the client
    const isGroqError = error?.constructor?.name === "APIError";
    const status = isGroqError && error.status === 429 ? 429 : 500;
    const message =
      status === 429
        ? "Too many requests. Please wait a moment and try again."
        : "AI service is temporarily unavailable. Please try again.";

    console.error("[aiController] Groq error:", error?.message ?? error);
    return res.status(status).json({ message });
  }
};
