import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoDB from "./db/mongoDB";
import Message from "./db/models/Message";
import { GetMessagesCallback, SendMessagePayload } from "./types/socket";
import userRouter from "./routes/user";

dotenv.config();
mongoDB();

const app = express();
const server = http.createServer(app);
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new user connected", socket.id);

  socket.on("send_message", async (data: SendMessagePayload) => {
    const NewMessage = await Message.create({ message: data.message });
    io.emit("receive_message", NewMessage);
  });

  socket.on("get_messages", async (cb: GetMessagesCallback) => {
    const messages = await Message.find().sort({ createdAt: 1 });
    cb(messages);
  });
});
app.use("/user", userRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
