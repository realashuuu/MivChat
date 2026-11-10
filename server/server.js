import express from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
export const userSocketMap = {};

// Socket.io connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User is connected", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect database before starting server
await connectDB();

const PORT = process.env.PORT || 6000;

if (process.env.NODE_ENV != "production") {
  server.listen(PORT, () => {
    console.log("Server is running on the port: " + PORT);
  });
}

//export server for versal
export default server;
