import React, { useContext, useRef } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import { LuCamera, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser, updateUser } = useContext(UserContext);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadRes = await uploadImage(file);
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE_IMAGE,
        { profileImageUrl: uploadRes.imageUrl }
      );
      updateUser(response.data);
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to update profile picture.");
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.AUTH.DELETE_PROFILE_IMAGE
      );
      updateUser(response.data);
      toast.success("Profile picture removed!");
    } catch (error) {
      console.error("Error deleting profile image:", error);
      toast.error("Failed to remove profile picture.");
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-56px)] bg-white dark:bg-slate-900 border-r border-gray-200/50 dark:border-slate-800 p-5 sticky top-[56px] z-20 transition-colors duration-200">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        <div className="relative group cursor-pointer">
          {user?.profileImageUrl ? (
            <>
              <img
                src={user?.profileImageUrl || ""}
                alt="Profile Image"
                className="w-20 h-20 bg-slate-400 rounded-full object-cover"
                onClick={() => fileInputRef.current?.click()}
              />
              <button
                onClick={handleDeleteProfileImage}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove profile picture"
              >
                <LuTrash2 size={12} />
              </button>
            </>
          ) : (
            <div onClick={() => fileInputRef.current?.click()}>
              <CharAvatar
                fullName={user?.fullName}
                width="w-20"
                height="h-20"
                style="text-xl"
              />
            </div>
          )}
          <div
            className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="Upload profile picture"
          >
            <LuCamera size={14} />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageUpload}
          />
        </div>

        <h5 className="text-gray-950 dark:text-slate-100 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label ? "text-white bg-primary" : "hover:bg-gray-50 dark:hover:bg-slate-800"
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;

