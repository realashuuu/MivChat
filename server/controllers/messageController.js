import cloudinary from "cloudinary";
import Message from "../models/message.js";
import User from "../models/user.js";
import { io, userSocketMap } from "../server.js";

// Get all users except logged-in user
export const getUserforSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    // Count unread messages for each user
    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const message = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (message.length > 0) {
        unseenMessages[user._id] = message.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const myId = req.user._id;

    // Get all messages between logged-in user and selected user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // NEW: Fetch unread messages BEFORE marking them as seen
    const unreadMessages = await Message.find({
      senderId: selectedUserId,
      receiverId: myId,
      seen: false,
    });

    // Mark incoming unread messages as seen
    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          senderId: selectedUserId,
          receiverId: myId,
          seen: false,
        },
        {
          $set: { seen: true },
        },
      );
    }

    // Update returned messages so the UI shows the correct read status
    const unreadIds = new Set(
      unreadMessages.map((message) => message._id.toString()),
    );

    const updatedMessages = messages.map((message) => ({
      ...message.toObject(),
      seen: unreadIds.has(message._id.toString()) ? true : message.seen,
    }));

    // Notify the original sender that their messages have been read
    const senderSocketId = userSocketMap[selectedUserId];

    if (senderSocketId && unreadMessages.length > 0) {
      io.to(senderSocketId).emit("messagesSeen", {
        messageIds: unreadMessages.map((message) => message._id.toString()),
      });
    }

    res.json({
      success: true,
      messages: updatedMessages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Mark message as seen using message ID
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    // Update only if logged-in user is the message receiver
    const message = await Message.findOneAndUpdate(
      {
        _id: id,
        receiverId: req.user._id,
      },
      {
        $set: { seen: true },
      },
      {
        new: true,
      },
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Get sender's active Socket.IO connection
    const senderSocketId = userSocketMap[message.senderId.toString()];

    // Notify sender that the message has been read
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", {
        messageIds: [message._id.toString()],
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Mark Message Seen Error:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.v2.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      media: imageUrl,
    });

    // Emit new message to receiver's socket
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
