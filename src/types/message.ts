import { Types } from "mongoose";

type messageTyp = "text" | "image" | "file";

export interface IMessage {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: messageTyp;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessagePopulated {
  _id: Types.ObjectId;
  message: string;
  roomId: string;
  userId: {
    _id: string;
    username: string;
  };
}
