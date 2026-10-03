import React from "react";
import assets, { imagesDummyData } from "../assets/assets";

const RightSidebar = ({ selectedUser }) => {
  return (
    selectedUser && (
      <div
        className={`text-white w-full h-full relative overflow-y-auto scroll-smooth bg-[#8185B2]/10 border-l border-gray-700/50 p-5 flex flex-col justify-between ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center pt-4">
          {/* User Profile Image & Online Badge */}
          <div className="relative">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt={selectedUser?.fullName || "User"}
              className="w-20 h-20 rounded-full object-cover aspect-square border-2 border-violet-500/50 shadow-md"
            />
            <span className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#282142] absolute bottom-0.5 right-0.5"></span>
          </div>

          {/* User Details */}
          <div className="px-2">
            <h1 className="text-lg font-semibold text-white">
              {selectedUser?.fullName}
            </h1>
            <p className="text-xs text-gray-300 font-light mt-1 max-w-[220px] mx-auto leading-relaxed">
              {selectedUser?.bio || "Hey there! I am using MivChat."}
            </p>
          </div>

          <hr className="border-gray-700/60 my-2 w-full" />

          {/* Shared Media Section */}
          <div className="w-full text-left text-xs">
            <p className="text-gray-300 font-medium mb-2.5">Shared Media</p>
            <div className="max-h-[220px] overflow-y-auto scroll-smooth grid grid-cols-3 gap-2 pr-1">
              {imagesDummyData?.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url, "_blank")}
                  className="cursor-pointer rounded-lg overflow-hidden aspect-square border border-gray-700/50 hover:opacity-90 hover:scale-105 transition-all duration-200 bg-gray-800/40"
                >
                  <img
                    src={url}
                    alt={`media-${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 pb-2 text-center">
          <button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white py-2.5 px-4 rounded-full text-xs font-medium shadow-md hover:shadow-violet-500/20 transition-all duration-200 cursor-pointer">
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default RightSidebar;