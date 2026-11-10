import cloudinary from "cloudinary";
import Message from "../models/message.js";
import User from "../models/user.js";
import { io, userSocketMap } from "../server.js";

//Get all user accept logged in user

export const getUserforSidebar = async (req, res) => {
  try {
    const userId = req.user._id; //this is the logged-in user id means sender id who is using the app.
    //Find all users whose ID is NOT equal to the logged-in user’s ID..except the password.
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );
    //count number of unread messages for each user
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const message = await Message.find({
        sender: user._id, //Message was sent by this sidebar user
        receiver: userId, //Message was received by the logged-in user means to me
        seen: false, //Message has not been read
      });
      if (message.length > 0) {
        unseenMessages[user._id] = message.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//Get all messages for selected User
export const getMessages = async (req, res) => {
  try {
    const selectedUserId = req.params.id; //this is the selected user id from the sidebar thorugh the URL parameter
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        //$or MongoDB operator hai.. Di gayi conditions mein se koi ek condition match honi chahiye.
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

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
    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//api to mark message as seen using msg id

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//send message to seleqcted user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id; //whome I am sending message to
    const senderId = req.user._id; //me who is send message

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
    //emit the new messages to the receivers socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
