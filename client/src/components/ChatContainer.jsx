import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formateMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesDummyData, selectedUser]);

  return selectedUser ? (
    <div className="relative h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 mx-4 border-b border-stone-500">
        <img src={assets.profile_martin} alt="" className="w-8 rounded-full" />

        <p className="flex text-sm text-white flex-1 items-center gap-2">
          Martin Johnson
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />

        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5 cursor-pointer" />
      </div>

      {/* Chat details - Scrollable Container */}
      <div className="flex-1 flex flex-col p-3 pb-6 overflow-y-auto scroll-smooth">
        {messagesDummyData.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              message.senderId !== "680f50e4f10f3cd28382ecf9"
                ? "flex-row-reverse"
                : ""
            }`}
          >
            {message.image ? (
              <img
                src={message.image}
                alt=""
                className="max-w-[230px] border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  message.senderId === "680f50e4f10f3cd28382ecf9"
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {message.text}
              </p>
            )}

            <div>
              <img
                src={
                  message.senderId === "680f50e4f10f3cd28382ecf9"
                    ? assets.avatar_icon
                    : assets.profile_martin
                }
                alt=""
                className="w-7 rounded-full"
              />

              <p className="text-gray-500 text-[11px]">
                {formateMessageTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Area / Input Bar */}
      <div className="flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center px-3 rounded-full bg-gray-100/12">
          <input
            type="text"
            placeholder="Send a message"
            className="text-sm p-3 flex-1 border-none bg-transparent outline-none text-white placeholder-gray-400"
          />

          <input type="file" id="image" accept="image/png, image/jpeg" hidden />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img src={assets.send_button} alt="" className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/50 max-md:hidden h-full">
      <img src={assets.logo_icon} alt="" className="max-w-16" />

      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;