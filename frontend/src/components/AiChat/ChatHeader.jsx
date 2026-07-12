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
      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      aria-label="Close AI assistant"
    >
      <LuX size={16} />
    </button>
  </div>
);

export default ChatHeader;
