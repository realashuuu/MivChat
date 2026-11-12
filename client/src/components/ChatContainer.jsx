import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formateMessageTime } from "../libs/utils.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import toast from "react-hot-toast";

// MivChat Send Sound
const sendAudio = new Audio("/sendsound.mp3");

const playSendSound = () => {
  sendAudio.currentTime = 0;
  sendAudio.play().catch(() => {});
};

// Format date labels for messages
const formatDateLabel = (dateString) => {
  if (!dateString) return null;

  const msgDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (msgDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return msgDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: msgDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessages, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();

  const [input, setInput] = useState("");
  const [sendingMessages, setSendingMessages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle sending text messages
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (input.trim() === "") return;
    const messageText = input.trim();
    const tempId = Date.now();
    setSendingMessages((prev) => [...prev, { id: tempId, text: messageText }]);
    setInput("");
    try {
      const success = await sendMessages({ text: messageText });
      // Play sound only when message is successfully sent
      if (success) {
        playSendSound();
      }
    } finally {
      setSendingMessages((prev) =>
        prev.filter((message) => message.id !== tempId),
      );
    }
  };

  // Handle sending image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select an Image file");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        await sendMessages({ image: reader.result });
      } finally {
        e.target.value = "";
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read image");
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
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, selectedUser, sendingMessages]);

  // Close image preview on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewImage(null);
      }
    };

    if (previewImage) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewImage]);

  return selectedUser ? (
    <>
      <div className="relative h-full flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 py-3.5 px-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <div className="relative shrink-0">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
            />

            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#1e1b2e]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {selectedUser.fullName}
            </p>

            <p className="text-[11px] text-gray-400">
              {onlineUsers.includes(selectedUser._id) ? (
                <span className="text-emerald-400">Online</span>
              ) : (
                "Offline"
              )}
            </p>
          </div>

          <img
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            alt="Back"
            className="md:hidden w-6 cursor-pointer opacity-80 hover:opacity-100 transition"
          />

          <img
            src={assets.help_icon}
            alt="Help"
            className="max-md:hidden w-5 cursor-pointer opacity-75 hover:opacity-100 transition"
          />
        </div>

        {/* Chat Details - Scrollable Container */}
        <div className="flex-1 flex flex-col gap-3.5 p-4 overflow-y-auto scroll-smooth">
          {messages.map((message, index) => {
            const isMe = message.senderId === authUser?._id;

            const currentDateLabel = formatDateLabel(message.createdAt);

            const prevDateLabel =
              index > 0 ? formatDateLabel(messages[index - 1].createdAt) : null;

            const showDateSeparator =
              currentDateLabel && currentDateLabel !== prevDateLabel;

            return (
              <React.Fragment key={message._id || index}>
                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex justify-center my-1.5">
                    <span className="px-3 py-0.5 text-[11px] font-medium text-gray-300 bg-white/10 border border-white/10 rounded-full backdrop-blur-xs">
                      {currentDateLabel}
                    </span>
                  </div>
                )}

                {/* Message Row */}
                <div
                  className={`flex items-end gap-2.5 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Receiver Avatar */}
                  {!isMe && (
                    <img
                      src={selectedUser?.profilePic || assets.avatar_icon}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-4 ring-1 ring-white/15"
                    />
                  )}

                  {/* Message Bubble + Footer Metadata */}
                  <div
                    className={`flex flex-col max-w-[72%] sm:max-w-[60%] ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Image Message */}
                    {message.media ? (
                      <div
                        onClick={() => setPreviewImage(message.media)}
                        className="p-1 rounded-2xl bg-white/10 border border-white/10 shadow-md overflow-hidden cursor-zoom-in group"
                      >
                        <img
                          src={message.media}
                          alt="Attachment"
                          className="max-w-[230px] rounded-xl object-cover group-hover:opacity-95 transition"
                        />
                      </div>
                    ) : (
                      /* Text Message */
                      <div
                        className={`px-3.5 py-2.5 text-sm leading-relaxed break-words shadow-sm ${
                          isMe
                            ? "bg-violet-600/85 text-white rounded-2xl rounded-br-xs"
                            : "bg-white/10 text-gray-100 border border-white/10 rounded-2xl rounded-bl-xs"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    {/* Timestamp & Read/Sent Status */}
                    <div
                      className={`flex items-center gap-1.5 mt-1 px-1 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="text-[10px] text-gray-400">
                        {formateMessageTime(message.createdAt)}
                      </span>

                      {isMe && (
                        <span
                          className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${
                            message.seen ? "text-emerald-400" : "text-gray-400"
                          }`}
                        >
                          {message.seen ? (
                            <>
                              {/* Read Icon */}
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 6 7 17l-5-5" />
                                <path d="m22 10-7.5 7.5L13 16" />
                              </svg>

                              <span>Read</span>
                            </>
                          ) : (
                            <>
                              {/* Sent Icon */}
                              <svg
                                className="w-3 h-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>

                              <span>Sent</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sender Avatar */}
                  {isMe && (
                    <img
                      src={authUser?.profilePic || assets.avatar_icon}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-4 ring-1 ring-violet-400/30"
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* Temporary Sending Messages */}
          {sendingMessages.map((message) => (
            <div
              key={message.id}
              className="flex items-end justify-end gap-2.5"
            >
              <div className="flex flex-col items-end max-w-[72%] sm:max-w-[60%]">
                {/* Temporary Message Bubble */}
                <div className="px-3.5 py-2.5 text-sm leading-relaxed break-words bg-violet-600/50 text-white/90 rounded-2xl rounded-br-xs">
                  {message.text}
                </div>

                {/* Sending Indicator */}
                <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-400">
                  <span className="w-2 h-2 rounded-full border border-gray-400 border-t-transparent animate-spin" />
                  <span>Sending...</span>
                </div>
              </div>

              <img
                src={authUser?.profilePic || assets.avatar_icon}
                alt=""
                className="w-7 h-7 rounded-full object-cover shrink-0 mb-4 opacity-75 ring-1 ring-white/15"
              />
            </div>
          ))}

          <div ref={scrollEnd} />
        </div>

        {/* Bottom Area / Input Bar */}
        <div className="flex items-center gap-2.5 p-3 border-t border-white/10 bg-white/[0.02]">
          <div className="flex-1 flex items-center px-3.5 rounded-full bg-white/10 border border-white/10 focus-within:border-violet-400/50 transition">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) =>
                e.key === "Enter" ? handleSendMessage() : null
              }
              type="text"
              placeholder="Send a message..."
              className="text-sm py-2.5 flex-1 border-none bg-transparent outline-none text-white placeholder-gray-400"
            />

            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              hidden
            />

            <label
              htmlFor="image"
              className="p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <img
                src={assets.gallery_icon}
                alt="Upload image"
                className="w-5 cursor-pointer"
              />
            </label>
          </div>

          {/* Send Button */}
          <img
            onClick={handleSendMessage}
            src={assets.send_button}
            alt="Send"
            className="w-7 cursor-pointer hover:scale-110 transition"
          />
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] flex items-center justify-center"
          >
            <button
              onClick={() => setPreviewImage(null)}
              type="button"
              aria-label="Close preview"
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition cursor-pointer"
            >
              ✕ Close
            </button>

            <img
              src={previewImage}
              alt="Full-size preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  ) : (
    /* Empty Chat State */
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/50 max-md:hidden h-full">
      <img src={assets.logo_icon} alt="" className="max-w-16" />

      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>

      <p className="text-sm text-gray-400">
        Select a conversation to start messaging
      </p>
    </div>
  );
};

export default ChatContainer;
