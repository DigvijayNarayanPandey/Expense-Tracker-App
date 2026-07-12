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
          API_PATHS.AI.CHAT,
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
          content: `✅ Done! ₹${Number(txn.amount).toLocaleString("en-IN")} ${txn.type} added successfully. Want to add another?`,
          parsedData: null,
        };
        dispatch({ type: ACTIONS.ADD_AI_MSG, payload: successMsg });
        dispatch({ type: ACTIONS.CLEAR_PENDING });

        toast.success(`₹${Number(txn.amount).toLocaleString("en-IN")} ${txn.type} added!`);

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
