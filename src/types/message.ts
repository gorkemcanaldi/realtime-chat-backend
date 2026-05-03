import { Types } from "mongoose";

export interface IMessage {
  message: string;
  roomId: string;
  userId: Types.ObjectId;
}
// Populated
export interface IMessagePopulated {
  message: string;
  roomId: string;
  userId: {
    _id: string;
    username: string;
  };
}
