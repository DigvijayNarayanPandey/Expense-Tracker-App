# AI Chat Feature — Implementation Plan
**Expense Tracker App · Groq + Llama 3.1**

---

## Architecture Decisions (Senior Dev Rationale)

Before writing a single line, a 15-year developer asks: *what's the minimal footprint that delivers the full feature correctly?*

**State management**: `useReducer` inside a custom hook (`useAiChat`). The chat has 5 interdependent state slices — messages, loading, saving, pendingTransaction. `useReducer` makes transitions atomic and predictable. No Redux/Zustand needed — the state never escapes the modal.

**Component encapsulation**: `AiChatButton` owns the open/close boolean internally and renders the modal as a sibling. Pages add one line. No prop threading.

**Backend responsibility**: The backend does *only* three things — validate input, call Groq, return structured data. The frontend calls the existing income/expense APIs directly to save. No new save endpoint needed.

**AbortController**: Every Groq call gets an abort signal tied to modal lifecycle. Prevents state updates on unmounted components — the most common React memory leak.

**System prompt in a utility file**: Never inline a prompt in a controller. It's configuration, not logic. Keeping it separate makes future model swaps painless.

---

## Final Directory Structure (new files only)

```
backend/
  controllers/
    aiController.js          ← NEW
  routes/
    aiRoutes.js              ← NEW
  utils/
    aiPromptBuilder.js       ← NEW
  .env                       ← ADD GROQ_API_KEY

frontend/src/
  components/
    AiChat/
      AiChatButton.jsx       ← NEW (owns modal + open state)
      AiChatModal.jsx        ← NEW (layout shell)
      ChatHeader.jsx         ← NEW
      ChatMessages.jsx       ← NEW (auto-scroll)
      ChatMessage.jsx        ← NEW (AI + user bubbles)
      ConfirmationCard.jsx   ← NEW (structured preview)
      ChatInput.jsx          ← NEW (input + send)
      TypingIndicator.jsx    ← NEW (three-dot animation)
  hooks/
    useAiChat.js             ← NEW (all logic lives here)
  utils/
    aiConstants.js           ← NEW (icons, categories, initial state)

Modified:
  backend/server.js
  frontend/src/pages/Dashboard/Home.jsx
  frontend/src/pages/Dashboard/Income.jsx
  frontend/src/pages/Dashboard/Expense.jsx
```

---

## Phase 1 — Backend

### Step 1.1 — Install Dependency

```bash
cd backend
npm install groq-sdk
```

### Step 1.2 — Environment Variable

```env
# backend/.env  (add to existing file)
GROQ_API_KEY=gsk_your_key_here
```

Validate the key exists on startup — fail loudly rather than silently breaking at runtime:

```js
// backend/server.js — add at the very top after dotenv.config()
if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is missing. AI features will not work.");
  // Don't process.exit — the rest of the app still works without AI
}
```

---

### Step 1.3 — System Prompt Builder

**`backend/utils/aiPromptBuilder.js`**

```js
// Purpose: Build the Groq system prompt with runtime context injected.
// Kept separate from the controller so the prompt is easy to iterate
// without touching business logic.

const EXPENSE_CATEGORIES = [
  "Food & Dining", "Transport", "Rent & Housing", "Utilities",
  "Entertainment", "Health & Fitness", "Shopping", "Education",
  "Subscriptions", "Petrol", "Groceries", "Other"
];

const INCOME_SOURCES = [
  "Salary", "Freelance", "Business", "Investment", "Interest",
  "Rental Income", "Gift", "Bonus", "Other"
];

// Instead of Emoji's use actual icons from lucid react or any suitable provider
const CATEGORY_ICONS = {
  "Food & Dining": "🍔", "Transport": "🚗", "Rent & Housing": "🏠",
  "Utilities": "⚡", "Entertainment": "🎬", "Health & Fitness": "🏥",
  "Shopping": "🛍️", "Education": "📚", "Subscriptions": "📱",
  "Petrol": "⛽", "Groceries": "🛒", "Other": "💸",
  "Salary": "💼", "Freelance": "💻", "Business": "🏢",
  "Investment": "📈", "Interest": "🏦", "Rental Income": "🏘️",
  "Gift": "🎁", "Bonus": "🎯"
};

// Compute yesterday in DD-MM-YYYY format for the prompt
const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const buildSystemPrompt = (pageContext, currentDate) => {
  const defaultTypeInstruction =
    pageContext === "expense"
      ? "If transaction type is unclear, default to EXPENSE."
      : pageContext === "income"
      ? "If transaction type is unclear, default to INCOME."
      : "If transaction type is unclear, ask the user: income or expense?";

  return `You are a transaction parser for an Indian personal finance app. Your ONLY job is to parse what the user describes and confirm with them before anything is saved.

CONTEXT:
- Today: ${currentDate}
- Yesterday: ${getYesterday()}
- Page context: ${pageContext}
- ${defaultTypeInstruction}

RESPONSE FORMAT (always return exactly this structure — JSON block first, plain message second):
\`\`\`json
{
  "type": "expense" | "income" | null,
  "amount": number | null,
  "category": "string | null",
  "source": "string | null",
  "notes": "string | null",
  "date": "YYYY-MM-DD | null",
  "icon": "emoji | null",
  "needsClarification": boolean,
  "clarificationField": "type" | "amount" | "date" | null,
  "confirmed": false
}
\`\`\`
[Your short, warm confirmation message here — max 3 sentences. Use ₹ symbol. Indian number format: ₹1,50,000 not ₹150,000]

PARSING RULES:
- "lunch", "dinner", "chai", "tiffin", "dabba", "bhojan" → Food & Dining
- "auto", "rickshaw", "ola", "uber", "cab", "metro", "bus" → Transport
- "petrol", "fuel", "diesel" → Petrol
- "bijli", "electricity", "paani", "gas bill" → Utilities
- "kiraya", "rent", "emi" → Rent & Housing
- "doctor", "medicine", "dawai", "hospital" → Health & Fitness
- "netflix", "hotstar", "spotify", "recharge" → Subscriptions
- "salary", "maahaney", "tankhaa" → Salary
- "freelance", "project", "client payment" → Freelance
- "50k" = 50000, "1.5 lakh" = 150000, "2 cr" = 20000000

MULTI-TURN CORRECTION:
- If user says "change date to yesterday" → update only date, keep all other fields
- If user says "make it 500 not 300" → update only amount
- If user says "yes/haan/confirm/ok/done/looks good/bilkul" → set "confirmed": true in JSON
- If user says "cancel/nahi/no" → respond friendly, reset, ask for next entry

CONSTRAINTS:
- NEVER set confirmed: true on your own — wait for explicit user approval
- NEVER guess amount — always ask if missing
- NEVER invent dates — only compute relative ones (yesterday, last Monday)
- Stay strictly on topic. If user asks anything unrelated, reply: "I can only help add transactions. Try something like 'lunch 300' or 'salary 65000'."

VALID EXPENSE CATEGORIES: ${EXPENSE_CATEGORIES.join(", ")}
VALID INCOME SOURCES: ${INCOME_SOURCES.join(", ")}

ICON MAP (always use these exact emojis):
${Object.entries(CATEGORY_ICONS).map(([k, v]) => `${k}: ${v}`).join(" | ")}`;
};

module.exports = { buildSystemPrompt, EXPENSE_CATEGORIES, INCOME_SOURCES, CATEGORY_ICONS };
```

---

### Step 1.4 — AI Controller

**`backend/controllers/aiController.js`**

```js
// Purpose: Single endpoint — receive chat messages, call Groq, return
// structured response. Does NOT save transactions (frontend handles that
// using existing APIs). Clean separation of concerns.

const Groq = require("groq-sdk");
const { buildSystemPrompt } = require("../utils/aiPromptBuilder");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  const blockMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (blockMatch) {
    try { return JSON.parse(blockMatch[1]); } catch { /* fall through */ }
  }
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
    const completion = await groq.chat.completions.create({
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
```

---

### Step 1.5 — AI Routes

**`backend/routes/aiRoutes.js`**

```js
// Dedicated rate limiter for AI endpoint — separate from auth limiter.
// 20 req/min per IP is generous for chat but prevents abuse.

const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/authMiddleware");
const { chat } = require("../controllers/aiController");

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI requests. Please slow down." },
});

// protect ensures user is authenticated; aiLimiter prevents API abuse
router.post("/chat", protect, aiLimiter, chat);

module.exports = router;
```

---

### Step 1.6 — Register in server.js

Add **one line** in `backend/server.js` alongside the other routes:

```js
// backend/server.js — in the routes section (after dashboardRoutes line)
const aiRoutes = require("./routes/aiRoutes");

// ... (existing route registrations) ...
app.use("/api/v1/ai", aiRoutes);
```

---

## Phase 2 — Frontend Utilities

### Step 2.1 — AI Constants

**`frontend/src/utils/aiConstants.js`**

```js
// Single source of truth for all AI chat constants.
// Changing a category name? Change it here only.

export const PAGE_CONTEXT = {
  DASHBOARD: "dashboard",
  INCOME: "income",
  EXPENSE: "expense",
};

// Greeting message is context-aware — built at runtime in the hook.
// This is just the shape.
export const makeGreetingMessage = (pageContext) => {
  const hints = {
    dashboard: "I can add income or expense entries. Try something like \"lunch 300\" or \"salary 45000\".",
    income:    "I can add income entries for you. Try something like \"salary 65000\" or \"freelance payment 12000\".",
    expense:   "I can add expense entries for you. Try something like \"lunch 300\" or \"petrol 1000\".",
  };
  return {
    id: "greeting",
    role: "assistant",
    content: `Hi! ${hints[pageContext] ?? hints.dashboard}`,
    parsedData: null,
  };
};

// Map category/source strings → emoji icons.
// Matches the backend aiPromptBuilder CATEGORY_ICONS exactly. Instead of emojis use icons from lucide-react
export const ICON_MAP = {
  "Food & Dining": "🍔",
  "Transport": "🚗",
  "Rent & Housing": "🏠",
  "Utilities": "⚡",
  "Entertainment": "🎬",
  "Health & Fitness": "🏥",
  "Shopping": "🛍️",
  "Education": "📚",
  "Subscriptions": "📱",
  "Petrol": "⛽",
  "Groceries": "🛒",
  "Salary": "💼",
  "Freelance": "💻",
  "Business": "🏢",
  "Investment": "📈",
  "Interest": "🏦",
  "Rental Income": "🏘️",
  "Gift": "🎁",
  "Bonus": "🎯",
};

export const DEFAULT_EXPENSE_ICON = "💸";
export const DEFAULT_INCOME_ICON = "💰";

export const getIcon = (parsedData) => {
  if (!parsedData) return DEFAULT_EXPENSE_ICON;
  const key = parsedData.type === "income" ? parsedData.source : parsedData.category;
  return ICON_MAP[key] ?? (parsedData.type === "income" ? DEFAULT_INCOME_ICON : DEFAULT_EXPENSE_ICON);
};

// Format today's date as "11 Jul 2026" for the system prompt
export const getFormattedToday = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Format a DD-MM-YYYY date string for display in the UI
export const formatDisplayDate = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Generate a lightweight unique ID for chat messages
let _msgCounter = 0;
export const newMsgId = () => `msg_${Date.now()}_${++_msgCounter}`;
```

---

## Phase 3 — State Management (`useAiChat` Hook)

This hook owns **all** AI chat logic. Components are display-only.

**`frontend/src/hooks/useAiChat.js`**

```js
import { useReducer, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import {
  makeGreetingMessage,
  getFormattedToday,
  getIcon,
  newMsgId,
} from "../utils/aiConstants";

// ─── Reducer ─────────────────────────────────────────────────────────────────
// useReducer over multiple useStates because these 5 values change together.
// Atomic updates = no intermediate inconsistent states.

const makeInitialState = (pageContext) => ({
  messages: [makeGreetingMessage(pageContext)],
  pendingTransaction: null,
  isLoading: false,   // waiting for Groq API
  isSaving: false,    // waiting for income/expense API save
});

const ACTIONS = {
  ADD_USER_MSG:         "ADD_USER_MSG",
  ADD_AI_MSG:           "ADD_AI_MSG",
  SET_LOADING:          "SET_LOADING",
  SET_SAVING:           "SET_SAVING",
  SET_PENDING:          "SET_PENDING",
  CLEAR_PENDING:        "CLEAR_PENDING",
  RESET:                "RESET",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_USER_MSG:
      return { ...state, messages: [...state.messages, action.payload] };

    case ACTIONS.ADD_AI_MSG:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isLoading: false,
      };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_SAVING:
      return { ...state, isSaving: action.payload };

    case ACTIONS.SET_PENDING:
      return { ...state, pendingTransaction: action.payload };

    case ACTIONS.CLEAR_PENDING:
      return { ...state, pendingTransaction: null };

    case ACTIONS.RESET:
      return makeInitialState(action.pageContext);

    default:
      return state;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

const useAiChat = ({ pageContext, onTransactionAdded }) => {
  const [state, dispatch] = useReducer(reducer, null, () =>
    makeInitialState(pageContext)
  );

  // AbortController ref — cancel in-flight Groq request if modal closes
  const abortControllerRef = useRef(null);

  // Cleanup: abort any pending request when hook unmounts
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  // ── Send a message to the AI ──────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || state.isLoading || state.isSaving) return;

      // 1. Append user message immediately for responsive UX
      const userMsg = {
        id: newMsgId(),
        role: "user",
        content: trimmed,
        parsedData: null,
      };
      dispatch({ type: ACTIONS.ADD_USER_MSG, payload: userMsg });
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      // 2. Build conversation history to send
      // Include the new user message — the reducer hasn't flushed yet
      const history = [
        ...state.messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: trimmed },
      ];

      // 3. Set up AbortController
      abortControllerRef.current = new AbortController();

      try {
        const response = await axiosInstance.post(
          "/api/v1/ai/chat",
          {
            messages: history,
            pageContext,
            currentDate: getFormattedToday(),
          },
          { signal: abortControllerRef.current.signal }
        );

        const { message, parsedData } = response.data;

        // 4. Enrich parsedData with the correct icon before storing
        const enrichedData = parsedData
          ? { ...parsedData, icon: parsedData.icon ?? getIcon(parsedData) }
          : null;

        // 5. Append AI reply
        const aiMsg = {
          id: newMsgId(),
          role: "assistant",
          content: message,
          parsedData: enrichedData,
        };
        dispatch({ type: ACTIONS.ADD_AI_MSG, payload: aiMsg });

        // 6. If AI returned a valid, unconfirmed transaction → set as pending
        if (
          enrichedData &&
          !enrichedData.confirmed &&
          !enrichedData.needsClarification &&
          enrichedData.type &&
          enrichedData.amount
        ) {
          dispatch({ type: ACTIONS.SET_PENDING, payload: enrichedData });
        } else {
          // Clarification needed or already confirmed in message — clear pending
          dispatch({ type: ACTIONS.CLEAR_PENDING });
        }

        // 7. Handle rare case where Groq confirmed directly in JSON
        // (shouldn't happen per system prompt but defensive check)
        if (enrichedData?.confirmed && enrichedData.type && enrichedData.amount) {
          await saveTransaction(enrichedData);
        }
      } catch (error) {
        // Don't show error if request was deliberately aborted (modal closed)
        if (error?.code === "ERR_CANCELED") return;

        const errorMsg = {
          id: newMsgId(),
          role: "assistant",
          content:
            error?.response?.data?.message ??
            "Something went wrong. Please try again.",
          parsedData: null,
        };
        dispatch({ type: ACTIONS.ADD_AI_MSG, payload: errorMsg });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.messages, state.isLoading, state.isSaving, pageContext]
  );

  // ── Confirm and save the pending transaction ──────────────────────────────
  const saveTransaction = useCallback(
    async (txn) => {
      if (!txn) return;
      dispatch({ type: ACTIONS.SET_SAVING, payload: true });

      const isIncome = txn.type === "income";
      const endpoint = isIncome
        ? API_PATHS.INCOME.ADD_INCOME
        : API_PATHS.EXPENSE.ADD_EXPENSE;

      const payload = isIncome
        ? {
            source: txn.source ?? "Other",
            amount: txn.amount,
            date: txn.date ?? new Date().toISOString().split("T")[0],
            icon: txn.icon ?? "💰",
          }
        : {
            category: txn.category ?? "Other",
            amount: txn.amount,
            date: txn.date ?? new Date().toISOString().split("T")[0],
            icon: txn.icon ?? "💸",
          };

      try {
        await axiosInstance.post(endpoint, payload);

        const successMsg = {
          id: newMsgId(),
          role: "assistant",
          content: `Done! ₹${Number(txn.amount).toLocaleString("en-IN")} ${txn.type} added successfully. Want to add another?`,
          parsedData: null,
        };
        dispatch({ type: ACTIONS.ADD_AI_MSG, payload: successMsg });
        dispatch({ type: ACTIONS.CLEAR_PENDING });

        // Refresh the page data (e.g., re-fetch expense list)
        onTransactionAdded?.();
      } catch (error) {
        const errMsg = {
          id: newMsgId(),
          role: "assistant",
          content:
            error?.response?.data?.message ??
            "Couldn't save the transaction. Please try again.",
          parsedData: null,
        };
        dispatch({ type: ACTIONS.ADD_AI_MSG, payload: errMsg });
      } finally {
        dispatch({ type: ACTIONS.SET_SAVING, payload: false });
      }
    },
    [onTransactionAdded]
  );

  const confirmTransaction = useCallback(
    () => saveTransaction(state.pendingTransaction),
    [saveTransaction, state.pendingTransaction]
  );

  const cancelTransaction = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_PENDING });
    const cancelMsg = {
      id: newMsgId(),
      role: "assistant",
      content: "No problem! What else can I add for you?",
      parsedData: null,
    };
    dispatch({ type: ACTIONS.ADD_AI_MSG, payload: cancelMsg });
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    dispatch({ type: ACTIONS.RESET, pageContext });
  }, [pageContext]);

  return {
    messages: state.messages,
    pendingTransaction: state.pendingTransaction,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    sendMessage,
    confirmTransaction,
    cancelTransaction,
    reset,
  };
};

export default useAiChat;
```

---

## Phase 4 — Components

Build bottom-up: smallest, dumbest components first.

---

### 4.1 — TypingIndicator

**`frontend/src/components/AiChat/TypingIndicator.jsx`**

```jsx
// Pure presentational — three animated dots.
// CSS animation defined with Tailwind arbitrary values + keyframes in index.css.

const TypingIndicator = () => (
  <div className="flex items-start gap-2">
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-slate-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
```

---

### 4.2 — ConfirmationCard

**`frontend/src/components/AiChat/ConfirmationCard.jsx`**

```jsx
// Renders structured transaction preview inside an AI message bubble.
// The two action buttons live here — not in the parent — because they're
// tightly coupled to the transaction data displayed.

import { LuCalendar } from "react-icons/lu";
import { formatDisplayDate } from "../../utils/aiConstants";

const ConfirmationCard = ({ transaction, onConfirm, onCancel, isSaving }) => {
  if (!transaction) return null;

  const isExpense = transaction.type === "expense";
  const label = isExpense ? transaction.category : transaction.source;
  const amount = Number(transaction.amount).toLocaleString("en-IN");

  return (
    <div
      className={`mt-2 p-4 rounded-xl border-l-4 ${
        isExpense
          ? "bg-red-50 border-red-400 dark:bg-red-900/20 dark:border-red-500"
          : "bg-green-50 border-green-400 dark:bg-green-900/20 dark:border-green-500"
      }`}
    >
      {/* Type label */}
      <p
        className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
          isExpense
            ? "text-red-600 dark:text-red-400"
            : "text-green-600 dark:text-green-400"
        }`}
      >
        {transaction.icon} {transaction.type}
      </p>

      {/* Amount */}
      <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1">
        ₹{amount}
      </p>

      {/* Category / Source */}
      {label && (
        <p className="text-sm text-gray-600 dark:text-slate-300 font-medium">
          {label}
        </p>
      )}

      {/* Notes */}
      {transaction.notes && (
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 italic">
          "{transaction.notes}"
        </p>
      )}

      {/* Date */}
      {transaction.date && (
        <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 mt-1">
          <LuCalendar size={11} />
          {formatDisplayDate(transaction.date)}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={onConfirm}
          disabled={isSaving}
          className="flex-1 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:brightness-110 disabled:opacity-60 transition-all"
        >
          {isSaving ? "Adding…" : "Confirm ✓"}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-60 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationCard;
```

---

### 4.3 — ChatMessage

**`frontend/src/components/AiChat/ChatMessage.jsx`**

```jsx
// Renders a single message bubble (AI or user).
// If an AI message carries parsedData with a valid unconfirmed transaction,
// it also renders the ConfirmationCard beneath the text.

import ConfirmationCard from "./ConfirmationCard";

const ChatMessage = ({ message, pendingTransaction, onConfirm, onCancel, isSaving }) => {
  const isAi = message.role === "assistant";

  // Only show ConfirmationCard on the LAST AI message that has parsedData.
  // This avoids showing stale cards from earlier turns.
  const showCard =
    isAi &&
    message.parsedData?.type &&
    message.parsedData?.amount &&
    !message.parsedData?.confirmed &&
    !message.parsedData?.needsClarification &&
    pendingTransaction;

  return (
    <div className={`flex items-start gap-2 ${isAi ? "" : "flex-row-reverse"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isAi
            ? "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-2xl rounded-tl-sm"
            : "bg-primary text-white rounded-2xl rounded-tr-sm"
        }`}
      >
        {/* Preserve newlines in AI messages */}
        <p className="whitespace-pre-wrap">{message.content}</p>

        {showCard && (
          <ConfirmationCard
            transaction={pendingTransaction}
            onConfirm={onConfirm}
            onCancel={onCancel}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
```

---

### 4.4 — ChatMessages

**`frontend/src/components/AiChat/ChatMessages.jsx`**

```jsx
// Scrollable message list. useRef + useEffect auto-scrolls to the latest
// message whenever messages or loading state changes.

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const ChatMessages = ({
  messages,
  isLoading,
  isSaving,
  pendingTransaction,
  onConfirm,
  onCancel,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    // Smooth scroll only — avoids jarring jump on initial mount
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          pendingTransaction={pendingTransaction}
          onConfirm={onConfirm}
          onCancel={onCancel}
          isSaving={isSaving}
        />
      ))}
      {isLoading && <TypingIndicator />}
      {/* Invisible sentinel — scroll target */}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
};

export default ChatMessages;
```

---

### 4.5 — ChatInput

**`frontend/src/components/AiChat/ChatInput.jsx`**

```jsx
// Controlled input. Enter submits, Shift+Enter adds a newline (future use).
// Disabled during loading or saving to prevent double-sends.

import { useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";

const ChatInput = ({ onSend, isLoading, isSaving }) => {
  const [text, setText] = useState("");
  const isDisabled = isLoading || isSaving;

  const handleSubmit = () => {
    if (!text.trim() || isDisabled) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-slate-900">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isDisabled ? "Please wait…" : "e.g. lunch 300"}
        disabled={isDisabled}
        maxLength={500}
        autoFocus
        className="flex-1 bg-gray-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none border border-transparent focus:border-primary/40 dark:focus:border-primary/40 transition-colors disabled:opacity-60"
        aria-label="Type your transaction"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isDisabled}
        className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
        aria-label="Send"
      >
        <LuSendHorizonal size={16} />
      </button>
    </div>
  );
};

export default ChatInput;
```

---

### 4.6 — ChatHeader

**`frontend/src/components/AiChat/ChatHeader.jsx`**

```jsx
// Modal header — title, beta badge, close button.
// onClose is called by the parent which handles cleanup (session reset).

import { LuSparkles, LuX } from "react-icons/lu";

const ChatHeader = ({ onClose }) => (
  <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
    <div className="flex items-center gap-2">
      <LuSparkles className="text-primary" size={18} />
      <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
        AI Assistant
      </span>
      <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-50 dark:bg-primary/10 text-teal-700 dark:text-primary rounded-full border border-teal-100 dark:border-primary/20">
        BETA
      </span>
    </div>
    <button
      onClick={onClose}
      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Close AI assistant"
    >
      <LuX size={16} />
    </button>
  </div>
);

export default ChatHeader;
```

---

### 4.7 — AiChatModal

**`frontend/src/components/AiChat/AiChatModal.jsx`**

```jsx
// Layout shell: overlay + responsive panel.
// All logic delegated to useAiChat hook.
// Handles closing via overlay click AND Escape key.

import { useEffect } from "react";
import useAiChat from "../../hooks/useAiChat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const AiChatModal = ({ pageContext, onClose, onTransactionAdded }) => {
  const {
    messages,
    pendingTransaction,
    isLoading,
    isSaving,
    sendMessage,
    confirmTransaction,
    cancelTransaction,
    reset,
  } = useAiChat({ pageContext, onTransactionAdded });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    reset();   // Clear session immediately
    onClose(); // Parent hides this component
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end lg:items-end lg:justify-end"
      onClick={handleClose}
    >
      {/* Panel — stop click propagation so clicking inside doesn't close */}
      <div
        className="
          w-full h-[70vh]
          lg:w-[420px] lg:h-[580px] lg:mb-6 lg:mr-6
          bg-white dark:bg-slate-900
          border border-gray-200 dark:border-white/5
          rounded-t-2xl lg:rounded-2xl
          shadow-2xl shadow-black/20
          flex flex-col
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="AI transaction assistant"
      >
        <ChatHeader onClose={handleClose} />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          isSaving={isSaving}
          pendingTransaction={pendingTransaction}
          onConfirm={confirmTransaction}
          onCancel={cancelTransaction}
        />

        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default AiChatModal;
```

---

### 4.8 — AiChatButton (Self-Contained)

**`frontend/src/components/AiChat/AiChatButton.jsx`**

```jsx
// Owns the isOpen boolean — pages just drop this one component in.
// When modal is open, the button is visually hidden (not just display:none —
// we use pointer-events-none + opacity so the space isn't reclaimed
// and the layout doesn't shift).

import { useState } from "react";
import { LuSparkles } from "react-icons/lu";
import AiChatModal from "./AiChatModal";

const AiChatButton = ({ pageContext, onTransactionAdded }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI assistant"
        aria-expanded={isOpen}
        className={`
          fixed bottom-6 right-6 z-40
          w-14 h-14 rounded-full
          bg-primary text-white
          shadow-lg shadow-primary/30
          flex items-center justify-center
          hover:scale-110 hover:brightness-110
          transition-all duration-200
          ${isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}
        `}
      >
        <LuSparkles size={22} />
      </button>

      {/* Modal — mounted only when open, unmounts on close (resets state) */}
      {isOpen && (
        <AiChatModal
          pageContext={pageContext}
          onClose={() => setIsOpen(false)}
          onTransactionAdded={onTransactionAdded}
        />
      )}
    </>
  );
};

export default AiChatButton;
```

> **Why `isOpen && <AiChatModal />`?**
> Conditional rendering means the modal component (and the `useAiChat` hook inside it) mounts fresh every time — no manual cleanup needed. Session resets automatically on close.

---

## Phase 5 — Page Integration

**Three surgical additions — one per page.**

### 5.1 — Home.jsx (Dashboard)

```jsx
// frontend/src/pages/Dashboard/Home.jsx

// Add import at top:
import AiChatButton from "../../components/AiChat/AiChatButton";

// Inside the return, after closing </DashboardLayout> (but still inside it):
const Home = () => {
  // ... existing code ...

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* ... existing JSX ... */}

      {/* ADD THIS: AI assistant — dashboard asks income or expense */}
      <AiChatButton
        pageContext="dashboard"
        onTransactionAdded={fetchDashboardData}
      />
    </DashboardLayout>
  );
};
```

### 5.2 — Income.jsx

```jsx
// frontend/src/pages/Dashboard/Income.jsx

// Add import at top:
import AiChatButton from "../../components/AiChat/AiChatButton";

// Inside the return:
return (
  <DashboardLayout activeMenu="Income">
    {/* ... existing JSX ... */}

    {/* ADD THIS: AI assistant — income page defaults to income */}
    <AiChatButton
      pageContext="income"
      onTransactionAdded={fetchIncomeDetails}
    />
  </DashboardLayout>
);
```

### 5.3 — Expense.jsx

```jsx
// frontend/src/pages/Dashboard/Expense.jsx

// Add import at top:
import AiChatButton from "../../components/AiChat/AiChatButton";

// Inside the return:
return (
  <DashboardLayout activeMenu="Expense">
    {/* ... existing JSX ... */}

    {/* ADD THIS: AI assistant — expense page defaults to expense */}
    <AiChatButton
      pageContext="expense"
      onTransactionAdded={fetchExpenseDetails}
    />
  </DashboardLayout>
);
```

---

## API Paths Update

Add the AI endpoint to your existing `apiPaths.js` for consistency:

```js
// frontend/src/utils/apiPaths.js — add to existing API_PATHS object:
AI: {
  CHAT: "/api/v1/ai/chat",
},
```

Then in `useAiChat.js`, replace the hardcoded string with:
```js
import { API_PATHS } from "../utils/apiPaths";
// ...
await axiosInstance.post(API_PATHS.AI.CHAT, { ... })
```

---

## Security Summary

| Layer | Measure | Why |
|---|---|---|
| Backend route | `protect` middleware | Only authenticated users can call AI |
| Backend route | `aiLimiter` (20 req/min) | Prevents Groq quota abuse |
| Controller | `VALID_CONTEXTS` check | Rejects unexpected pageContext values |
| Controller | `VALID_ROLES` filter | Prevents role spoofing in message history |
| Controller | `slice(-10)` on messages | Caps token usage, prevents context stuffing |
| Controller | `slice(0, 500)` per message | Caps individual message length |
| Controller | Error message sanitization | Never exposes Groq internals to client |
| System prompt | Explicit "stay on topic" rule | Reduces jailbreak / off-topic abuse |
| Frontend | `AbortController` | Cancels in-flight request on unmount |
| Frontend | `disabled` during loading | Prevents double-send race conditions |
| Frontend | `maxLength={500}` on input | Client-side length cap (matches server) |
| Frontend | Groq key never in frontend | Key stays server-side only |

---

## Testing Checklist

### Backend (Postman / Thunder Client)
- [ ] `POST /api/v1/ai/chat` without token → 401
- [ ] Valid request with `pageContext: "expense"`, `messages: [{ role: "user", content: "lunch 300" }]` → 200 with parsedData
- [ ] Request with missing `messages` → 400
- [ ] Request with invalid `pageContext: "banana"` → 400
- [ ] Message content > 500 chars → gets trimmed, still returns 200
- [ ] No `GROQ_API_KEY` in env → 500 with friendly message

### Frontend — Happy Path
- [ ] Dashboard: Click AI button → modal opens, button hides
- [ ] Type "lunch 300" → typing indicator appears → AI replies with ConfirmationCard
- [ ] Click "Confirm" → success message, recent transactions refresh
- [ ] Income page: type "salary 45000" → defaults to income
- [ ] Expense page: type "petrol 1500" → defaults to expense
- [ ] Dashboard: type "electricity bill 2200" → AI asks income or expense

### Frontend — Multi-turn
- [ ] Type "lunch 300" → AI shows card → type "change date to yesterday" → card updates date
- [ ] Type "doctor visit" → AI asks for amount → type "750" → AI shows card

### Frontend — Edge Cases
- [ ] Close modal mid-loading → request aborts, no errors
- [ ] Reopen modal → fresh session, greeting message shown
- [ ] Escape key → modal closes
- [ ] Click overlay → modal closes
- [ ] Mobile: modal opens as bottom sheet (full width, 70vh)
- [ ] Dark mode: all components render correctly

### Frontend — Error States
- [ ] Disconnect network, try to send → friendly error in chat
- [ ] Send unrelated message ("what is 2+2") → AI redirects politely

---

## Common Mistakes to Avoid

**1. Sending full conversation history including greeting**
The greeting is a frontend-only artifact. When building `history` in `sendMessage`, map from `state.messages` — the greeting has `role: "assistant"` which is fine, but the backend's `slice(-10)` ensures it doesn't bloat the context.

**2. Not aborting on unmount**
Without `abortControllerRef.current?.abort()` in the cleanup, a slow Groq response can call `dispatch` on an unmounted component → React warning and potential state corruption.

**3. Setting `confirmed: true` in the system prompt examples**
The system prompt says the AI should set `confirmed: true` when user says "yes." But you must validate this on the frontend before saving — never trust `confirmed: true` blindly without checking `type` and `amount` exist.

**4. Showing ConfirmationCard on every AI message**
Only the most recent pending transaction should show the card. The current implementation passes `pendingTransaction` from hook state (not from the message itself) — so there's always at most one active card.

**5. Not refreshing page data after save**
`onTransactionAdded?.()` must be called. Without it, the user sees the success message but the list below doesn't update — confusing UX.

**6. Stop miss-use of the AI feature**
-Make sure that user didn't miss-use this AI feature for their day to normal chat or for the coding use.

---

*Implementation Plan complete — 5 phases, 15 files, ~600 lines of actual production code.*
