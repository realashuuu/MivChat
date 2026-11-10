import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formateMessageTime } from "../libs/utils.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import toast from "react-hot-toast";

const ChatContainer = ({}) => {
  const { messages, selectedUser, setSelectedUser, sendMessages, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();

  const [input, setInput] = useState("");

  // Handle sending message
  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    await sendMessages({ text: input.trim() });
    setInput("");
  };

  // Handle sending image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an Image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessages({ image: reader.result });
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  // Get messages for selected user
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  return selectedUser ? (
    <div className="relative h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 h-8 min-w-8 min-h-8 rounded-full object-cover shrink-0"
        />

        <p className="flex text-sm text-white flex-1 items-center gap-2">
          {selectedUser.fullName}

          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />

        <img
          src={assets.help_icon}
          alt=""
          className="max-md:hidden max-w-5 cursor-pointer"
        />
      </div>

      {/* Chat details - Scrollable Container */}
      <div className="flex-1 flex flex-col p-3 pb-6 overflow-y-auto scroll-smooth">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              message.senderId !== authUser?._id && "flex-row-reverse"
            }`}
          >
            {message.media ? (
              <img
                src={message.media}
                alt=""
                className="max-w-[230px] border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  message.senderId === authUser?._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {message.text}
              </p>
            )}

            {/* Sender and Receiver Profile Image */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <img
                src={
                  message.senderId === authUser?._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 h-7 min-w-7 min-h-7 rounded-full object-cover shrink-0"
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
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
            type="text"
            placeholder="Send a message"
            className="text-sm p-3 flex-1 border-none bg-transparent outline-none text-white placeholder-gray-400"
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
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
