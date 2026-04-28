require("dotenv").config();
const express = require("express");
const http = require("http");

const Message = require("./db/models/Message");
const mongoDB = require("./db/mongoDB");
mongoDB();

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new user connected", socket.id);

  socket.on("send_message", async (data) => {
    console.log("mesaj geldi", data);
    const NewMessage = await Message.create({ message: data.message });

    io.emit("receive_message", NewMessage);
  });

  socket.on("get_messages", async (cb) => {
    const messages = await Message.find().sort({ createdAt: 1 });
    cb(messages);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("server started at 3000");
});
