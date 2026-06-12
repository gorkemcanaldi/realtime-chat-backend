import { model, Schema } from "mongoose";
import { IFriendRequestTyp } from "../../types/friendRequest";

const FriendRequestSchema = new Schema<IFriendRequestTyp>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"] },
  },
  { timestamps: true },
);

export const FriendRequestModel = model<IFriendRequestTyp>(
  "FriendRequest",
  FriendRequestSchema,
);
