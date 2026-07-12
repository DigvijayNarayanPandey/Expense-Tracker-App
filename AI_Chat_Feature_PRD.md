# Product Requirements Document
## AI Chat Assistant — Expense Tracker App
**Version:** 1.0  
**Author:** Digvijay Narayan Pandey  
**Status:** Draft — Ready for Implementation  
**Last Updated:** July 2026

---

## Table of Contents

1. Executive Summary
2. Problem Statement
3. Goals & Non-Goals
4. User Stories
5. Feature Specification
6. Conversation Design & Flow
7. UI/UX Design Specification
8. Technical Architecture
9. Groq API Integration
10. Backend API Design
11. Frontend Component Design
12. Error Handling & Edge Cases
13. India-Specific Considerations
14. Security & Privacy
15. Implementation Roadmap
16. Open Questions

---

## 1. Executive Summary

The AI Chat Assistant is a conversational interface embedded inside the Expense Tracker App that allows users to add income and expense entries by describing them in plain, natural language — including casual Indian English like "lunch 300" or "received salary 45000." The assistant uses the **Groq API** (free tier, powered by Llama 3) to parse user intent, extract structured transaction data, present a confirmation to the user, and — upon approval — call the existing backend APIs to save the entry.

The feature lives behind a sticky floating button (bottom-right corner) visible on the Dashboard, Income, and Expense pages. Tapping it opens a semi-transparent overlay chat modal. The modal closes via a top-right close icon, clearing the session. This replaces no existing feature — it is purely additive.

---

## 2. Problem Statement

Currently, adding a transaction requires the user to:

1. Click "Add Income" or "Add Expense"
2. Open a modal form
3. Manually select an emoji icon
4. Type a source/category name
5. Enter an amount
6. Pick a date from a date picker
7. Click submit

For a user who just paid for an auto-rickshaw, grocery run, or received a freelance payment, this is **5–7 deliberate steps**. The cognitive overhead makes people forget to log, log later and forget details, or abandon the habit entirely.

The AI assistant collapses this into **one natural sentence**. The rest is handled automatically.

---

## 3. Goals & Non-Goals

### Goals

- Allow users to add income/expense entries via natural language in under 10 seconds.
- Support both casual single-turn inputs ("lunch 300") and multi-turn clarification ("actually change the date to yesterday").
- Always show a human-readable confirmation before writing to the database.
- Work correctly across mobile, tablet, and desktop screen sizes.
- Use the Groq free API tier — zero cost to the developer.
- Match the existing warm, minimal, Notion-like app aesthetic.
- Be ready to extend later (reporting, editing existing entries, etc.).

### Non-Goals (Out of Scope for v1.0)

- AI-powered financial advice or analysis.
- Editing or deleting existing transactions via chat.
- Answering questions like "How much did I spend this month?" (reporting).
- Voice input.
- Persistent chat history across days/devices.
- Push notifications or proactive AI suggestions.
- Multi-language support (Hindi, etc.) — English only for now.

---

## 4. User Stories

**US-01 — Quick Expense Entry**
> As a user on the Expense page, I want to type "lunch 300" and have the AI understand it means ₹300 expense in Food category today, so I can log it in one step.

**US-02 — Quick Income Entry**
> As a user on the Income page, I want to type "got freelance payment 15000" and have the AI add an income entry for ₹15,000 with source "Freelance" dated today.

**US-03 — Ambiguous Entry on Dashboard**
> As a user on the Dashboard, I want to type "electricity bill 2200" and have the AI ask me whether this is income or expense before adding it — since context is ambiguous from the dashboard.

**US-04 — Confirmation Before Saving**
> As a user, I want to see a clear preview card showing exactly what the AI plans to add — type, amount, category, and date — so I can confirm or correct it before it hits my data.

**US-05 — Multi-Turn Correction**
> As a user, after seeing the confirmation, I want to say "change the date to yesterday" and have the AI update only that field and re-confirm without starting over.

**US-06 — Session Clarity**
> As a user, when I close the chat modal, I want the conversation to reset so the next time I open it, it starts fresh with no memory of previous messages.

**US-07 — Responsive Access**
> As a mobile user, I want the AI chat button and modal to be accessible and usable on my phone screen without horizontal scrolling or broken layouts.

---

## 5. Feature Specification

### 5.1 The AI Floating Button

- Displayed on three pages: **Dashboard**, **Income**, **Expense**
- Positioned: `fixed bottom-6 right-6` (Tailwind), z-index above content, below modals
- Appearance: A circular button, `w-14 h-14`, `bg-primary` (teal `#0d9488`), white icon inside
- Icon: A sparkle/magic wand icon from `react-icons` (e.g., `LuSparkles`) to indicate AI
- Tooltip on hover (desktop): "Ask AI to add transaction"
- When modal is open: Button is hidden (`display: none` or `opacity-0 pointer-events-none`)
- Smooth entrance animation: scale in on mount with a subtle pulse on first visit

### 5.2 The Chat Modal

- Opens when the AI button is clicked
- Covers the entire viewport with a semi-transparent overlay: `bg-black/40 backdrop-blur-sm`
- The chat panel itself is centered or right-anchored, depending on screen size (see Section 7)
- Has a close icon (`LuX`) in the top-right corner of the panel header
- Clicking the close icon: closes modal AND clears the session (messages array reset to initial greeting)
- Clicking outside the panel (on the overlay): also closes modal and clears session
- Session is purely in-memory (React state) — nothing is stored in localStorage or the DB

### 5.3 Conversation Lifecycle

Each modal open is a **fresh session**. The lifecycle is:

```
Modal Opens
    ↓
AI sends greeting (context-aware based on current page)
    ↓
User types natural language input
    ↓
Message sent to Groq API with full system prompt
    ↓
Groq returns structured JSON + a human-friendly confirmation message
    ↓
Confirmation card shown in chat (not yet saved)
    ↓
User types "yes", "confirm", taps Confirm button, OR corrects details
    ↓
  [If confirmed] → Call existing backend API → Show success message
  [If corrected] → AI updates fields → Show new confirmation
  [If cancelled] → AI acknowledges, ready for next entry
    ↓
User can add another entry or close the modal
```

### 5.4 Context Awareness (Page-Specific Behavior)

| Current Page | Default Behavior |
|---|---|
| `/expense` | AI assumes all entries are expenses unless user says otherwise |
| `/income` | AI assumes all entries are income unless user says otherwise |
| `/dashboard` | AI has no default — asks "Is this income or expense?" when ambiguous |
| `/transactions` | AI button not shown (read-only page) |

The current page context is passed as a variable in the system prompt sent to Groq on every message.

---

## 6. Conversation Design & Flow

### 6.1 System Prompt Architecture

The Groq API call includes a **system prompt** that instructs the LLM to behave as a transaction parser, not a general assistant. The system prompt:

- Tells the AI its only job is to extract transaction data and confirm with the user
- Specifies the current page context (income/expense/dashboard)
- Tells the AI to always respond with a JSON block + a human message
- Tells the AI to use ₹ and Indian date formats (DD MMM YYYY)
- Tells the AI the current date (injected at runtime)
- Lists valid categories for income and expense
- Tells the AI to ask for clarification when fields are genuinely missing, not guess blindly

**System Prompt Template (simplified):**

```
You are a friendly transaction assistant inside an Indian personal finance app.

Today's date is: {{CURRENT_DATE}} (e.g., 11 Jul 2026)
Current page: {{PAGE_CONTEXT}} (income | expense | dashboard)

Your only job is to help the user add income or expense entries.

When the user describes a transaction, extract:
- type: "income" or "expense"
- amount: number in INR
- category (for expense): Food, Transport, Rent, Utilities, Entertainment, 
  Health, Shopping, Education, Subscriptions, Other
- source (for income): Salary, Freelance, Business, Investment, Gift, Other
- date: default to today unless user specifies
- notes: optional, any extra context

Rules:
1. Always respond with a JSON block inside ```json ``` markers AND a 
   human-readable confirmation message below it.
2. If "type" is ambiguous and page is dashboard, ask the user.
3. If amount is missing, ask the user.
4. If date is "yesterday", "last Monday", etc., compute from today's date.
5. Never add the entry yourself. Always confirm first.
6. If user confirms (says yes/confirm/looks good/haan), set "confirmed": true 
   in your JSON.
7. If user asks to change a field, update only that field and re-confirm.
8. Keep responses short, warm, and in plain Indian English.
9. Use ₹ symbol, not "Rs" or "INR".
10. On income page, default type to income. On expense page, default to expense.

Expense categories: Food & Dining, Transport, Rent & Housing, Utilities,
Entertainment, Health & Fitness, Shopping, Education, Subscriptions, 
Auto-rickshaw & Cab, Groceries, Petrol, Other

Income sources: Salary, Freelance, Business, Investment, Interest, 
Rental Income, Gift, Bonus, Other
```

### 6.2 Conversation Examples

**Example A — Single turn (Expense page):**
```
User: lunch 300

AI:  Here's what I'll add:
     ─────────────────────
     💸 Expense
     ₹300 — Food & Dining
     "Lunch"
     📅 11 Jul 2026
     ─────────────────────
     Shall I add this? (yes / no / change something)
```

**Example B — Income with multi-turn correction:**
```
User: received salary 65000

AI:  Got it! Here's the entry:
     ─────────────────────
     💰 Income
     ₹65,000 — Salary
     "Salary"
     📅 11 Jul 2026
     ─────────────────────
     Confirm?

User: change date to 1st July

AI:  Updated! Here's the revised entry:
     ─────────────────────
     💰 Income
     ₹65,000 — Salary
     "Salary"
     📅 01 Jul 2026
     ─────────────────────
     Confirm?

User: yes

AI:  ✅ Done! ₹65,000 income added successfully.
     Want to add another entry?
```

**Example C — Ambiguous on Dashboard:**
```
User: electricity bill 2200

AI:  Is this an expense (paying the bill) or 
     income (receiving a payment)? Just checking 
     since you're on the dashboard.

User: expense

AI:  Makes sense! Here's the entry:
     ─────────────────────
     💸 Expense
     ₹2,200 — Utilities
     "Electricity Bill"
     📅 11 Jul 2026
     ─────────────────────
     Confirm?
```

**Example D — Missing amount:**
```
User: I went to the doctor

AI:  Got it — Health expense. How much did you spend?

User: 800

AI:  Here's the entry:
     ─────────────────────
     💸 Expense
     ₹800 — Health & Fitness
     "Doctor Visit"
     📅 11 Jul 2026
     ─────────────────────
     Confirm?
```

### 6.3 Confirmation UI

The confirmation is NOT shown as plain text. It renders as a **structured card inside the chat bubble** with:
- A colored left border (green for income, red for expense)
- The type emoji (💰 income, 💸 expense)
- Amount in bold with ₹ and Indian formatting
- Category/Source tag
- Date in "11 Jul 2026" format
- A notes line (if present)
- Two inline buttons: **Confirm** and **Cancel**

This means even non-text-savvy users understand what's about to be saved.

---

## 7. UI/UX Design Specification

### 7.1 Design Tokens (Inheriting from Existing App)

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#0d9488` | Confirm buttons, AI button, active states |
| Background (light) | `#fcfbfc` | Modal panel bg |
| Background (dark) | `#0e0e11` | Modal panel bg in dark mode |
| Border (light) | `#e4e4e7` | Panel border, message borders |
| Border (dark) | `rgba(255,255,255,0.05)` | Panel border dark |
| Font | `Poppins` | All text (inherited) |
| Overlay | `rgba(0,0,0,0.4)` + `backdrop-blur-sm` | Semi-transparent page overlay |
| Expense accent | `#ef4444` (red-500) | Confirmation card left border |
| Income accent | `#22c55e` (green-500) | Confirmation card left border |

### 7.2 AI Floating Button Spec

```
Position:  fixed bottom-6 right-6, z-50
Size:      w-14 h-14 (56px × 56px)
Shape:     rounded-full
Color:     bg-primary (#0d9488)
Shadow:    shadow-lg shadow-primary/30
Icon:      LuSparkles (white, size 22)
Hover:     scale-110, brightness-110
Transition: transition-all duration-200
Hidden when: modal is open (opacity-0 pointer-events-none)

Mobile:    Same, but bottom-4 right-4
```

### 7.3 Modal Layout — Desktop (lg and above)

```
┌─────────────────────────────────────────────────────────────┐
│               Semi-transparent overlay (full screen)         │
│                                                              │
│                                  ┌──────────────────────┐   │
│                                  │  ┌──────────────────┐│   │
│                                  │  │ ✦ AI Assistant  X││   │
│                                  │  │ Expense Tracker  ││   │
│                                  │  └──────────────────┘│   │
│                                  │                       │   │
│                                  │  ┌──────────────────┐│   │
│                                  │  │  AI greeting msg ││   │
│                                  │  └──────────────────┘│   │
│                                  │                       │   │
│                                  │  ┌──────────────────┐│   │
│                                  │  │ [User message]   ││   │
│                                  │  └──────────────────┘│   │
│                                  │                       │   │
│                                  │  ┌──────────────────┐│   │
│                                  │  │ Confirmation Card││   │
│                                  │  │ 💸 ₹300 · Food  ││   │
│                                  │  │ [Confirm][Cancel]││   │
│                                  │  └──────────────────┘│   │
│                                  │                       │   │
│                                  │  ┌────────────────┐  │   │
│                                  │  │ Type here...  →│  │   │
│                                  │  └────────────────┘  │   │
│                                  └──────────────────────┘   │
│                                    w-[420px], right-6,       │
│                                    bottom-6, h-[580px]       │
└─────────────────────────────────────────────────────────────┘
```

### 7.4 Modal Layout — Mobile (below md)

```
┌─────────────────────────────────┐
│  Semi-transparent overlay       │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ✦ AI Assistant          X│  │
│  │─────────────────────────│  │
│  │                          │  │
│  │  [AI greeting]           │  │
│  │                          │  │
│  │  [User message]          │  │
│  │                          │  │
│  │  ┌─────────────────────┐ │  │
│  │  │ 💸 ₹300 · Food      │ │  │
│  │  │ 11 Jul 2026         │ │  │
│  │  │ [Confirm]  [Cancel] │ │  │
│  │  └─────────────────────┘ │  │
│  │                          │  │
│  │  ┌──────────────────────┐│  │
│  │  │ Type here...       →││  │
│  │  └──────────────────────┘│  │
│  └───────────────────────────┘  │
│  Full width, bottom-anchored    │
│  h-[70vh], rounded-t-2xl        │
└─────────────────────────────────┘
```

### 7.5 Panel Design Spec

```
Desktop panel:
  width:          420px (fixed)
  height:         580px (fixed, inner scrollable)
  position:       fixed right-6 bottom-6
  border-radius:  rounded-2xl (16px)
  border:         1px solid var(--border-color)
  background:     bg-white dark:bg-slate-900
  shadow:         shadow-2xl shadow-black/15
  overflow:       hidden

Mobile panel:
  width:          100vw
  height:         70vh
  position:       fixed bottom-0 left-0 right-0
  border-radius:  rounded-t-2xl (top corners only)
  Same border/bg/shadow as desktop
```

### 7.6 Chat Message Styles

**AI message bubble:**
```
align:        left
bg:           bg-gray-100 dark:bg-slate-800
border-radius: rounded-2xl rounded-tl-sm
padding:      px-4 py-3
max-width:    85%
font-size:    text-sm
text:         text-gray-800 dark:text-slate-100
```

**User message bubble:**
```
align:        right
bg:           bg-primary
border-radius: rounded-2xl rounded-tr-sm
padding:      px-4 py-3
max-width:    80%
font-size:    text-sm
text:         text-white
```

**Confirmation card (inside AI bubble):**
```
border-left:  4px solid (green for income, red for expense)
background:   bg-green-50 dark:bg-green-900/20 (income)
              bg-red-50 dark:bg-red-900/20 (expense)
border-radius: rounded-xl
padding:      p-4
margin-top:   mt-2
```

**Input bar:**
```
position:     sticky bottom-0
background:   bg-white dark:bg-slate-900
border-top:   1px solid border-gray-100 dark:border-white/5
padding:      p-3
input:        flex-1, bg-gray-50 dark:bg-slate-800, rounded-xl, px-4 py-2
send button:  bg-primary, rounded-xl, px-3 py-2, LuSendHorizonal icon
```

### 7.7 Header Spec

```
height:       h-14 (56px)
background:   bg-white dark:bg-slate-900
border-bottom: 1px solid border-gray-100 dark:border-white/5
padding:      px-4
content:
  Left:  LuSparkles icon (text-primary) + "AI Assistant" (font-medium)
         + small pill badge: "Beta" (bg-teal-50 text-teal-700 text-xs px-2 py-0.5)
  Right: LuX icon button (text-gray-400 hover:text-gray-700)
         w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800
```

### 7.8 Loading State

While waiting for Groq API response:
- Show a typing indicator (three animated dots) as an AI bubble
- Send button shows a spinner, is disabled
- Input is disabled during loading
- If response takes >10s, show: "Taking longer than usual…"

---

## 8. Technical Architecture

### 8.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│                                                          │
│  Page (Dashboard/Income/Expense)                         │
│    └── AiChatButton.jsx (floating button)                │
│          └── AiChatModal.jsx (modal + session state)     │
│                ├── ChatHeader.jsx                        │
│                ├── ChatMessages.jsx                      │
│                │     ├── AiMessage.jsx                   │
│                │     ├── UserMessage.jsx                 │
│                │     └── ConfirmationCard.jsx            │
│                └── ChatInput.jsx                         │
└──────────────────────────┬──────────────────────────────┘
                           │ POST /api/v1/ai/chat
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                     │
│                                                          │
│  POST /api/v1/ai/chat                                    │
│    └── aiController.js                                   │
│          ├── Receives: { messages[], pageContext,        │
│          │               currentDate }                   │
│          ├── Builds system prompt with page context      │
│          ├── Calls Groq API → gets response              │
│          ├── Parses JSON from response                   │
│          └── Returns: { message, parsedData, confirmed } │
│                                                          │
│  (Existing routes used directly from frontend)           │
│  POST /api/v1/income/add   ← called when confirmed      │
│  POST /api/v1/expense/add  ← called when confirmed      │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Groq API   │
                    │ (Free tier) │
                    │ Llama 3.1   │
                    └─────────────┘
```

### 8.2 Data Flow Detail

```
Step 1: User types "lunch 300" → ChatInput captures it

Step 2: AiChatModal appends user message to messages[] state
        messages = [
          { role: "assistant", content: "Hi! I'm ready..." },
          { role: "user", content: "lunch 300" }
        ]

Step 3: POST /api/v1/ai/chat
        Body: {
          messages: [...],
          pageContext: "expense",
          currentDate: "11 Jul 2026"
        }

Step 4: aiController builds final messages array for Groq:
        [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages (from request body)
        ]

Step 5: Call Groq API → returns response content

Step 6: Parse response → extract JSON block + human message

Step 7: Return to frontend:
        {
          message: "Here's what I'll add: ...",
          parsedData: {
            type: "expense",
            amount: 300,
            category: "Food & Dining",
            notes: "Lunch",
            date: "2026-07-11",
            confirmed: false
          }
        }

Step 8: Frontend renders AI message + ConfirmationCard

Step 9: User clicks Confirm button

Step 10: Frontend calls existing API directly:
         POST /api/v1/expense/add  (with JWT token)
         Body: {
           icon: "🍔",
           category: "Food & Dining",
           amount: 300,
           date: "2026-07-11"
         }

Step 11: Success → AI sends "✅ Done!" message in chat
         + page data refreshes automatically
```

### 8.3 Session State Shape

```javascript
// AiChatModal internal state
const [messages, setMessages] = useState([
  {
    role: "assistant",
    content: "Hi! I can add your income or expense. Just describe it naturally — like 'lunch 300' or 'salary 45000'.",
    type: "greeting"
  }
]);

const [pendingTransaction, setPendingTransaction] = useState(null);
// pendingTransaction shape:
// {
//   type: "income" | "expense",
//   amount: 300,
//   category: "Food & Dining",   // for expense
//   source: "Salary",            // for income
//   notes: "Lunch",
//   date: "2026-07-11",
//   icon: "🍔"
// }

const [isLoading, setIsLoading] = useState(false);
const [inputText, setInputText] = useState("");
```

---

## 9. Groq API Integration

### 9.1 Setup

1. Sign up at `console.groq.com` (free, no credit card)
2. Create API key → copy to `.env`
3. Install in backend: `npm install groq-sdk`

```bash
# backend/.env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

### 9.2 Model Selection

| Model | Context | Speed | Free |
|---|---|---|---|
| `llama-3.1-8b-instant` | 128K tokens | Ultra fast | ✅ |
| `llama-3.1-70b-versatile` | 128K tokens | Fast | ✅ |
| `mixtral-8x7b-32768` | 32K tokens | Fast | ✅ |

**Recommended**: `llama-3.1-8b-instant` — fast enough for chat, free, good at JSON extraction. Fall back to `llama-3.1-70b-versatile` if parsing accuracy needs improvement.

### 9.3 Groq API Call (Backend)

```javascript
// backend/controllers/aiController.js
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.chat = async (req, res) => {
  const { messages, pageContext, currentDate } = req.body;

  const systemPrompt = buildSystemPrompt(pageContext, currentDate);

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.3,      // Low = more deterministic/accurate parsing
      max_tokens: 500,        // Responses are short
      stream: false
    });

    const rawContent = response.choices[0].message.content;

    // Parse JSON block from response
    const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
    let parsedData = null;
    
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[1]);
    }

    // Extract human message (everything after the JSON block)
    const humanMessage = rawContent.replace(/```json\n[\s\S]*?\n```/, "").trim();

    res.status(200).json({
      message: humanMessage,
      parsedData,
      rawContent
    });
  } catch (error) {
    res.status(500).json({ 
      message: "I'm having trouble right now. Please try again in a moment.",
      error: error.message 
    });
  }
};
```

### 9.4 Rate Limits (Groq Free Tier)

| Limit | Value |
|---|---|
| Requests per minute | 30 |
| Requests per day | 14,400 |
| Tokens per minute | 14,400 (8b model) |

This is more than sufficient for a personal finance app. A typical chat session uses 3-5 API calls.

---

## 10. Backend API Design

### 10.1 New Route

```
POST /api/v1/ai/chat
Auth: Protected (requires JWT via protect middleware)
```

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "lunch 300" }
  ],
  "pageContext": "expense",
  "currentDate": "11 Jul 2026"
}
```

**Response:**
```json
{
  "message": "Here's what I'll add:\n₹300 expense for Lunch in Food & Dining today.\nConfirm?",
  "parsedData": {
    "type": "expense",
    "amount": 300,
    "category": "Food & Dining",
    "source": null,
    "notes": "Lunch",
    "date": "2026-07-11",
    "icon": "🍔",
    "confirmed": false,
    "needsClarification": false,
    "clarificationField": null
  }
}
```

### 10.2 New Files to Create

```
backend/
  controllers/
    aiController.js     ← NEW
  routes/
    aiRoutes.js         ← NEW
```

### 10.3 Register Route in server.js

```javascript
// Add to backend/server.js
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/v1/ai", aiRoutes);
```

### 10.4 Transaction Saving (Frontend Calls Existing APIs)

When the user confirms, the **frontend** directly calls the existing backend endpoints. No new backend endpoint is needed for saving — we reuse:

- `POST /api/v1/income/add` — for income entries
- `POST /api/v1/expense/add` — for expense entries

The AI just helps build the payload. Saving is handled the same way as the existing forms.

### 10.5 Icon Mapping

The AI returns a category string. Map it to an emoji icon before saving:

```javascript
// frontend/src/utils/aiIconMap.js
const EXPENSE_ICON_MAP = {
  "Food & Dining": "🍔",
  "Transport": "🚗",
  "Auto-rickshaw & Cab": "🛺",
  "Groceries": "🛒",
  "Rent & Housing": "🏠",
  "Utilities": "⚡",
  "Entertainment": "🎬",
  "Health & Fitness": "🏥",
  "Shopping": "🛍️",
  "Education": "📚",
  "Subscriptions": "📱",
  "Petrol": "⛽",
  "Other": "💸"
};

const INCOME_ICON_MAP = {
  "Salary": "💼",
  "Freelance": "💻",
  "Business": "🏢",
  "Investment": "📈",
  "Interest": "🏦",
  "Rental Income": "🏘️",
  "Gift": "🎁",
  "Bonus": "🎯",
  "Other": "💰"
};
```

---

## 11. Frontend Component Design

### 11.1 File Structure

```
frontend/src/
  components/
    AiChat/
      AiChatButton.jsx       ← Floating button
      AiChatModal.jsx        ← Main modal, session state
      ChatHeader.jsx         ← Title + close icon
      ChatMessages.jsx       ← Scrollable message list
      ChatMessage.jsx        ← Individual message bubble
      ConfirmationCard.jsx   ← Structured preview card
      ChatInput.jsx          ← Input bar + send button
      TypingIndicator.jsx    ← Animated dots while loading
  utils/
    aiIconMap.js             ← Category to emoji mapping
    aiUtils.js               ← Date parsing helpers
```

### 11.2 Where to Add the AI Button

In each page component, add `<AiChatButton />` at the bottom level:

```jsx
// pages/Dashboard/Home.jsx (and Income.jsx, Expense.jsx)
import AiChatButton from "../../components/AiChat/AiChatButton";

const Home = () => {
  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* existing content */}
      <AiChatButton pageContext="dashboard" />
    </DashboardLayout>
  );
};
```

The `pageContext` prop tells the modal which default behavior to use.

### 11.3 Post-Confirmation Page Refresh

After a successful AI-assisted entry, the page should refresh its data. This is handled by passing a callback:

```jsx
<AiChatButton 
  pageContext="expense" 
  onTransactionAdded={fetchExpenseDetails}
/>
```

When the AI confirms and saves successfully, it calls `onTransactionAdded()` to re-fetch the list — same pattern used by the existing "Add Expense" form modal.

---

## 12. Error Handling & Edge Cases

### 12.1 Groq API Errors

| Error | Frontend Display |
|---|---|
| 401 Unauthorized | "AI is not configured properly. Please contact support." |
| 429 Rate Limited | "Getting too many requests. Please wait a moment and try again." |
| 500 Server Error | "I'm having trouble right now. Please try again in a moment." |
| Timeout (>15s) | "This is taking longer than usual. Try rephrasing your request." |
| JSON parse failure | Fall back to showing raw AI text, hide confirmation card |

### 12.2 Ambiguous / Unparseable Input

If Groq can't extract a transaction from the message (e.g., user typed "hello" or gibberish), the AI should respond helpfully:

```
User: what is 2+2

AI: I can only help you add income or expense entries. 
    Try something like "lunch 300" or "salary 65000".
```

The system prompt instructs the model to stay in scope and redirect politely.

### 12.3 Very Large Amounts

If amount exceeds ₹1,00,00,000 (1 crore), show a confirmation warning:
```
AI: Just checking — ₹1,20,00,000 is a large amount.
    Did you mean ₹1,20,000 perhaps?
```

### 12.4 Future Dates

If the user gives a future date, the AI should flag it:
```
AI: 15 Aug 2026 is in the future. Are you planning ahead,
    or did you mean a past date?
```

### 12.5 Missing Required Field (Amount)

The AI must ask — never guess:
```
User: I went to the doctor

AI: Got it — Health expense. How much did you spend?
```

### 12.6 Network Offline

If the device is offline when user submits a message, show:
```
AI: Looks like you're offline. Please check your 
    connection and try again.
```

---

## 13. India-Specific Considerations

### 13.1 Currency Formatting

All amounts displayed using Indian number system:
- ₹300 (under ₹1,000)
- ₹1,500 (thousands)
- ₹65,000 (tens of thousands)
- ₹1,50,000 (lakhs — NOT ₹150,000)
- ₹12,50,000 (12.5 lakhs)

Use `Number(amount).toLocaleString("en-IN")` — already used in the app.

### 13.2 Date Formats

- Display: "11 Jul 2026" (no ambiguity between DD/MM and MM/DD)
- Storage: ISO format "2026-07-11" (passed to existing API)
- The AI system prompt uses "11 Jul 2026" format explicitly

### 13.3 Relative Date Understanding

The AI should handle Indian English date references:
- "yesterday" → compute from today
- "last Monday" → compute from today
- "1st July" → July 1st of current year
- "this month's salary" → 1st of current month
- "just now" / "abhi" → today

### 13.4 India-Specific Categories

Categories in the system prompt include India-relevant options:
- **Auto-rickshaw & Cab** (not just "Transport")
- **Petrol** (separate from general transport)
- **Tiffin / Dabba** maps to Food & Dining
- **EMI** maps to Rent & Housing
- **Medicine** maps to Health & Fitness

### 13.5 Casual Indian English Inputs the AI Must Handle

```
"auto 80"           → Expense, ₹80, Auto-rickshaw & Cab
"bhai ne diya 500"  → Income, ₹500, Gift
"recharge 199"      → Expense, ₹199, Subscriptions
"ola 250"           → Expense, ₹250, Transport
"petrol 1000"       → Expense, ₹1,000, Petrol
"sir ne bonus diya 5000" → Income, ₹5,000, Bonus
"netflix 649"       → Expense, ₹649, Subscriptions
"kiraya 12000"      → Expense, ₹12,000, Rent & Housing
"bijli bill 2200"   → Expense, ₹2,200, Utilities
```

These examples should be included in the system prompt as few-shot examples.

---

## 14. Security & Privacy

### 14.1 Authentication

The `/api/v1/ai/chat` route uses the existing `protect` middleware. Users must be logged in to use the AI feature. Their transaction data is never sent to Groq — only the natural language description of a new transaction.

### 14.2 What Is Sent to Groq

Sent to Groq: User's natural language chat messages (e.g., "lunch 300")  
NOT sent to Groq: User's existing transactions, account balance, email, name, or any PII.

### 14.3 API Key Security

The Groq API key lives only in `backend/.env`. It is never exposed to the frontend. All Groq calls happen server-side.

### 14.4 Rate Limiting

The existing `express-rate-limit` middleware on `/api/v1/auth` should be extended or a new limiter created for `/api/v1/ai` to prevent abuse:

```javascript
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,                  // 20 AI messages per minute per IP
  message: { message: "Too many requests. Please slow down." }
});

app.use("/api/v1/ai", aiLimiter, aiRoutes);
```

---

## 15. Implementation Roadmap

### Phase 1 — Backend Foundation (Day 1–2)
- [ ] Install `groq-sdk` in backend
- [ ] Add `GROQ_API_KEY` to `.env`
- [ ] Create `aiController.js` with `chat` function
- [ ] Create `aiRoutes.js` and register in `server.js`
- [ ] Write and test the system prompt using Postman/Thunder Client
- [ ] Test with 10 sample Indian expense descriptions
- [ ] Add rate limiter for AI route

### Phase 2 — Core Frontend Components (Day 3–4)
- [ ] Create `AiChatButton.jsx` (floating button, hidden when modal open)
- [ ] Create `AiChatModal.jsx` (session state, overlay, close behavior)
- [ ] Create `ChatHeader.jsx`
- [ ] Create `ChatMessages.jsx` + `ChatMessage.jsx`
- [ ] Create `TypingIndicator.jsx`
- [ ] Create `ChatInput.jsx`

### Phase 3 — Confirmation & Save Flow (Day 5)
- [ ] Create `ConfirmationCard.jsx` (green/red border card)
- [ ] Wire Confirm button → call existing income/expense API
- [ ] Wire Cancel button → AI acknowledges, ready for next
- [ ] Create `aiIconMap.js`
- [ ] Pass `onTransactionAdded` callback → refresh page data

### Phase 4 — Integration (Day 6)
- [ ] Add `<AiChatButton pageContext="dashboard" />` to `Home.jsx`
- [ ] Add `<AiChatButton pageContext="income" />` to `Income.jsx`
- [ ] Add `<AiChatButton pageContext="expense" />` to `Expense.jsx`
- [ ] Test full flow on all three pages

### Phase 5 — Polish & Edge Cases (Day 7)
- [ ] Dark mode testing across all components
- [ ] Mobile/tablet responsive testing
- [ ] Error state UI (offline, rate limit, API failure)
- [ ] Loading/typing indicator timing
- [ ] Scroll to latest message behavior
- [ ] Accessibility: keyboard navigation, focus management
- [ ] Test all Indian English examples from Section 13.5

---

## 16. Open Questions

| # | Question | Default Assumption |
|---|---|---|
| Q1 | Should the AI button appear on the `/transactions` page? | No — transactions page is read-only |
| Q2 | Should confirmed entries trigger a toast notification in addition to the chat success message? | Yes — use existing `react-hot-toast` for consistency |
| Q3 | If the user is adding from the Dashboard, should the newly added entry appear in the recent transactions list automatically? | Yes — call `fetchDashboardData()` after save |
| Q4 | Should the AI button be shown to unauthenticated users? | No — protected behind auth, same as rest of dashboard |
| Q5 | For Phase 2 (future), should the AI also support editing transactions? | Out of scope for v1.0 |

---

## Appendix A — Groq Free Tier Quick Reference

```
Sign up:    console.groq.com
Model:      llama-3.1-8b-instant
RPM:        30 requests/minute
RPD:        14,400 requests/day
TPM:        14,400 tokens/minute
Cost:       $0 (free tier)
No credit card required: ✅
```

## Appendix B — Files to Create (Summary)

**Backend (new):**
```
backend/controllers/aiController.js
backend/routes/aiRoutes.js
```

**Backend (modify):**
```
backend/server.js              ← Add aiRoutes
backend/.env                   ← Add GROQ_API_KEY
backend/package.json           ← Add groq-sdk
```

**Frontend (new):**
```
frontend/src/components/AiChat/AiChatButton.jsx
frontend/src/components/AiChat/AiChatModal.jsx
frontend/src/components/AiChat/ChatHeader.jsx
frontend/src/components/AiChat/ChatMessages.jsx
frontend/src/components/AiChat/ChatMessage.jsx
frontend/src/components/AiChat/ConfirmationCard.jsx
frontend/src/components/AiChat/ChatInput.jsx
frontend/src/components/AiChat/TypingIndicator.jsx
frontend/src/utils/aiIconMap.js
frontend/src/utils/aiUtils.js
```

**Frontend (modify):**
```
frontend/src/pages/Dashboard/Home.jsx    ← Add AiChatButton
frontend/src/pages/Dashboard/Income.jsx ← Add AiChatButton
frontend/src/pages/Dashboard/Expense.jsx ← Add AiChatButton
```

---

*End of PRD — Version 1.0*
