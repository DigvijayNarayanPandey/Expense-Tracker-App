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
