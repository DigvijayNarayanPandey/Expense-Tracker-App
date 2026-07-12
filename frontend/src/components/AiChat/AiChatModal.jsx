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
          lg:w-[420px] lg:h-[560px] lg:max-h-[calc(100vh-88px)] lg:mb-6 lg:mr-6
          bg-white dark:bg-slate-900
          border border-gray-200 dark:border-white/5
          rounded-t-2xl lg:rounded-2xl
          shadow-2xl shadow-black/20
          flex flex-col
          overflow-hidden
          animate-slide-up lg:animate-fade-in
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
