import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type, max, onKeyDown, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className="text-[13px] text-slate-800 dark:text-slate-300">{label}</label>
      <div className="input-box">
        <input
          type={
            type == "password" ? showPassword ? "text" : "password" : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent text-black dark:text-white outline-none"
          value={value}
          onChange={(e) => onChange(e)}
          onKeyDown={onKeyDown}
          max={max}
          autoComplete={autoComplete}
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
