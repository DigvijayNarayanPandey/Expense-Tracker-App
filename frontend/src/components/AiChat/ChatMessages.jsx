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
