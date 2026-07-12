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
          cursor-pointer
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
