import React, { useState } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = userDummyData.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`h-full p-5 bg-[#8185B2]/10 border-r border-gray-700/50 overflow-y-auto scroll-smooth text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <img
              src={assets.logo_icon}
              alt="MivChat"
              className="w-9 h-9 object-contain"
            />
            <h1 className="text-xl font-semibold tracking-wide text-white">
              Miv<span className="text-[#936EFF]">Chat</span>
            </h1>
          </div>
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-w-5 cursor-pointer hover:opacity-80 transition-opacity"
            />
            <div className="absolute top-full right-0 z-20 w-36 p-4 rounded-xl bg-[#282142] border border-gray-600/80 text-gray-100 hidden group-hover:block shadow-xl backdrop-blur-md">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-violet-400 transition-colors"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-600" />
              <p className="cursor-pointer text-sm hover:text-red-400 transition-colors">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="rounded-full bg-[#282142] flex items-center gap-2 py-2.5 px-4 mt-5 border border-gray-700/50 focus-within:border-violet-500/50 transition-colors">
          <img src={assets.search_icon} alt="Search" className="w-3.5 opacity-70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              onClick={() => setSelectedUser(user)}
              key={user._id || index}
              className={`relative flex items-center gap-3 p-2.5 rounded-xl cursor-pointer max-sm:text-sm transition-all duration-200 ${
                selectedUser?._id === user._id
                  ? "bg-[#282142]/80 border border-violet-500/30"
                  : "hover:bg-[#282142]/40"
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt={user.fullName}
                className="rounded-full w-10 h-10 object-cover aspect-square"
              />
              <div className="flex flex-col leading-tight">
                <p className="font-medium text-white">{user.fullName}</p>
                {index < 3 ? (
                  <span className="text-green-400 text-xs mt-0.5">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs mt-0.5">Offline</span>
                )}
              </div>
              {index > 2 && (
                <p className="absolute right-3 top-1/2 -translate-y-1/2 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 text-white font-medium">
                  {index}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-gray-400 py-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;