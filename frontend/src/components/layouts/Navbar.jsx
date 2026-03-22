import React, { useContext, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuSun, LuMoon } from "react-icons/lu";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import CharAvatar from "../Cards/CharAvatar";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setSideMenu] = useState(false);
  const { user } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="sticky top-0 z-30">
      <div className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-3 px-7 shadow-sm shadow-gray-200/60 dark:shadow-slate-800/60 transition-colors duration-200">
        {/* Left section: Hamburger + Logo + Title */}
        <div className="flex items-center gap-4">
          <button
            className="block lg:hidden text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800"
            onClick={() => {
              setSideMenu(!openSideMenu);
            }}
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center shadow-md shadow-emerald-300/40 dark:shadow-none">
              <span className="text-white text-lg font-bold">₹</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 tracking-tight">
              Expense Tracker
            </h2>
          </div>

          {/* Active page indicator */}
          {activeMenu && (
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-slate-700">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                {activeMenu}
              </span>
            </div>
          )}
        </div>

        {/* Right section: User info */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right mr-1">
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100 leading-tight">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-600 dark:text-slate-400">Welcome back 👋</p>
              </div>
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100 dark:ring-purple-900"
                />
              ) : (
                <CharAvatar
                  fullName={user.fullName}
                  width="w-9"
                  height="h-9"
                  style="text-sm"
                />
              )}
            </div>
            
            <button 
               onClick={toggleTheme} 
               className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
               aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
            </button>
          </div>
        )}
      </div>

      {/* Gradient accent line */}
      <div className="h-[2px] bg-gradient-to-r from-gray-500 via-primary to-gray-600" />

      {/* Mobile side menu */}
      {openSideMenu && (
        <div className="fixed top-[54px] left-0 bg-white dark:bg-slate-900 shadow-xl lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
