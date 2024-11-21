const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL) // Removed deprecated options
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log("Error connecting to DB: ", err.message);
  });

// Ping endpoint
app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start the server
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

// Initialize Socket.io
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend URL
    credentials: true,
  },
});

global.onlineUsers = new Map();

// Socket event handlers
io.on("connection", (socket) => {
  global.chatSocket = socket;

  // Add user to online users map
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
  });

  // Handle message sending
  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
