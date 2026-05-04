import { Types } from "mongoose";

export interface IMessage {
  _id: Types.ObjectId;
  message: string;
  roomId: string;
  userId: Types.ObjectId;
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
