import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-primary text-white rounded-lg">
          {icon ? (
            icon.length <= 10 ? (
              <span className="text-3xl">{icon}</span>
            ) : (
              <img src={icon} alt="Icon" className="w-12 h-12" />
            )
          ) : (
            <LuImage />
          )}
        </div>

        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{icon ? "Change\nIcon" : "Pick\nIcon"}</p>
      </div>

      {isOpen && (
        <div className="relative w-full sm:w-auto">
          <button className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-gray-200 dark:border-slate-700 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer" onClick={() => setIsOpen(false)}>
            <LuX />
          </button>
          <EmojiPicker
            open={isOpen}
            style={{ width: "100%" }}
            onEmojiClick={(emoji) => onSelect(emoji?.imageUrl || "")}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
