// Controlled input. Enter submits, Shift+Enter adds a newline (future use).
// Disabled during loading or saving to prevent double-sends.

import { useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";

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
        className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0 cursor-pointer"
        aria-label="Send"
      >
        <LuSendHorizontal size={16} />
      </button>
    </div>
  );
};

export default ChatInput;
