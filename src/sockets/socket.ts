import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import MessageModel from "../db/models/Message";
import { userModel } from "../db/models/User";
import { socketHandler } from "../utils/socketHandler";
import { IMessagePopulated } from "../types/message";
const rooms: Record<
  string,
  { socketId: string; userId: string; username: string }[]
> = {};
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

    socket.on(
      "join_room",
      socketHandler(async (roomId: string) => {
        if (!roomId || typeof roomId !== "string") return;

        socket.join(roomId);

        const user = await userModel.findById(socket.data.userId);
        if (!rooms[roomId]) {
          rooms[roomId] = [];
        }
        const exists = rooms[roomId].some((u) => u.socketId === socket.id);

        if (!exists) {
          rooms[roomId].push({
            socketId: socket.id,
            userId: socket.data.userId,
            username: user?.username || "unknown",
          });
        }
        io.to(roomId).emit("room_users", rooms[roomId]);

        const messages = await MessageModel.find({ roomId })
          .populate("userId", "username")
          .lean();

        const formattedMessages = messages.map((m: any) => ({
          message: m.message,
          roomId: m.roomId,
          username: m.userId.username,
          userId: m.userId._id.toString(),
          _id: m._id,
        }));
        socket.emit("room_message", formattedMessages);
      }),
    );
    socket.on(
      "send_message",
      socketHandler(async (data: { message: string; roomId: string }) => {
        if (!data.message?.trim()) return;
        const message = await MessageModel.create({
          message: data.message,
          roomId: data.roomId,
          userId: socket.data.userId,
        });

        const popMessage = (await message.populate(
          "userId",
          "username",
        )) as unknown as IMessagePopulated;

        io.to(data.roomId).emit("receive_message", {
          _id: popMessage._id,
          message: popMessage.message,
          roomId: popMessage.roomId,
          username: (popMessage.userId as any).username,
          userId: (popMessage.userId as any)._id.toString(),
        });
      }),
    );

    socket.on("disconnect", async () => {
      if (!socket.data.userId) return;
      console.log("user disconnected", socket.id);

      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter((u) => u.socketId !== socket.id);
        io.to(roomId).emit("room_users", rooms[roomId]);
      }

      await userModel.findByIdAndUpdate(socket.data.userId, {
        lastSeen: new Date(),
      });
    });
  });
};
