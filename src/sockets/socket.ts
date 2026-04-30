import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import MessageModel from "../db/models/Message";

export const initServer = (io: Server) => {
  io.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        socket.disconnect();
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      socket.data.userId = decoded.id;
      console.log("user connected", socket.id);

      socket.on("join_room", async (roomId) => {
        socket.join(roomId);
        const message = await MessageModel.find({ roomId });
        socket.emit("room_message", message);
      });
      socket.on("send_message", async (data) => {
        const message = await MessageModel.create({
          message: data.message,
          roomId: data.roomId,
          userId: socket.data.userId,
        });
        socket.to(data.roomId).emit("receive_message", message);
      });
    } catch (error) {
      socket.disconnect();
    }
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
};
