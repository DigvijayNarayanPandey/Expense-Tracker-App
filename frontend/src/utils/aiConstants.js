// Single source of truth for all AI chat constants.
// Changing a category name? Change it here only.

export const PAGE_CONTEXT = {
  DASHBOARD: "dashboard",
  INCOME: "income",
  EXPENSE: "expense",
};

// Greeting message is context-aware — built at runtime in the hook.
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
// Matches the backend aiPromptBuilder CATEGORY_ICONS exactly.
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

// Format an ISO date string for display in the UI
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
