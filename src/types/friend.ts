import { Types } from "mongoose";

export interface IFriend {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  friendId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
