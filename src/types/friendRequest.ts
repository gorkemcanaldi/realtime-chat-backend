import { Types } from "mongoose";

type FriendRequestStatus = "pending" | "accepted" | "rejected";

export interface IFriendRequestTyp {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}
