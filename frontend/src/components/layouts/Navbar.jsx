import React, { useContext, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/userContext";
import CharAvatar from "../Cards/CharAvatar";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setSideMenu] = useState(false);
  const { user } = useContext(UserContext);

  return (
    <div className="sticky top-0 z-30">
      <div className="flex items-center justify-between bg-white/95 backdrop-blur-md py-3 px-7 shadow-sm shadow-gray-200/60">
        {/* Left section: Hamburger + Logo + Title */}
        <div className="flex items-center gap-4">
          <button
            className="block lg:hidden text-gray-700 hover:text-primary transition-colors p-1 rounded-lg hover:bg-purple-50"
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
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-purple-300/40">
              <span className="text-white text-lg font-bold">₹</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
              Expense Tracker
            </h2>
          </div>

          {/* Active page indicator */}
          {activeMenu && (
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-gray-500 font-medium">
                {activeMenu}
              </span>
            </div>
          )}
        </div>

        {/* Right section: User info */}
        {user && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right mr-1">
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-600">Welcome back 👋</p>
            </div>
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
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
        )}
      </div>

      {/* Gradient accent line */}
      <div className="h-[2px] bg-gradient-to-r from-gray-500 via-primary to-gray-600" />

      {/* Mobile side menu */}
      {openSideMenu && (
        <div className="fixed top-[54px] left-0 bg-white shadow-xl lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
