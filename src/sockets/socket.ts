import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import MessageModel from "../db/models/Message";
import { userModel } from "../db/models/User";

export const initServer = (io: Server) => {
  io.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return socket.disconnect();
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      socket.data.userId = decoded.id;
      console.log("user connected", socket.id);
    } catch (error) {
      return socket.disconnect();
    }

    socket.on("join_room", async (roomId) => {
      socket.join(roomId);
      const messages = await MessageModel.find({ roomId });
      socket.emit("room_message", messages);
    });
    socket.on("send_message", async (data) => {
      const message = await MessageModel.create({
        message: data.message,
        roomId: data.roomId,
        userId: socket.data.userId,
      });
      socket.to(data.roomId).emit("receive_message", message);
    });

    socket.on("disconnect", async () => {
      if (!socket.data.userId) return;
      console.log("user disconnected", socket.id);
      await userModel.findByIdAndUpdate(socket.data.userId, {
        lastSeen: new Date(),
      });
    });
  });
};
