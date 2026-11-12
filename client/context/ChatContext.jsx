import { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  // NEW: Track message requests to prevent outdated responses
  const messagesRequestId = useRef(0);

  const { socket, axios } = useContext(AuthContext);

  // Function to get all users in the sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to get messages for selected user
  const getMessages = async (userId) => {
    // NEW: Create a unique request ID
    const requestId = ++messagesRequestId.current;

    // NEW: Clear previous conversation immediately
    setMessages([]);

    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      // NEW: Ignore outdated API responses
      if (requestId !== messagesRequestId.current) return;

      if (data.success) {
        setMessages(data.messages);

        // Clear unread message count for selected user
        setUnseenMessages((prev) => ({
          ...prev,
          [userId]: 0,
        }));
      }
    } catch (error) {
      // Only show errors for the latest request
      if (requestId === messagesRequestId.current) {
        toast.error(error.message);
      }
    }
  };

  // Function to send message to the selected user
  const sendMessages = async (messageData) => {
    if (!selectedUser) return false;

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
      );

      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);

        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  // Function to subscribe to messages for selected user
  const subscribeToMessages = () => {
    if (!socket || !selectedUser) return;

    const messageHandler = (newMessage) => {
      if (newMessage.senderId === selectedUser._id) {
        // Add incoming message and mark it as seen
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...newMessage, seen: true },
        ]);

        // Inform backend that the message has been seen
        axios.put(`/api/messages/mark/${newMessage._id}`).catch((error) => {
          console.error("Error marking message as seen:", error);
        });
      } else {
        // Update unread message count for other users
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    socket.on("newMessage", messageHandler);

    return () => {
      socket.off("newMessage", messageHandler);
    };
  };

  useEffect(() => {
    const unsubscribe = subscribeToMessages();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [socket, selectedUser]);

  // Listen for real-time read receipt updates
  useEffect(() => {
    if (!socket) return;

    const handleMessagesSeen = ({ messageIds }) => {
      if (!messageIds) return;

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          messageIds.includes(message._id)
            ? { ...message, seen: true }
            : message,
        ),
      );
    };

    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket]);

  const value = {
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
