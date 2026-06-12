import { model, Schema } from "mongoose";
import { IFriend } from "../../types/friend";

const FriendSchema = new Schema<IFriend>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const FriendModel = model<IFriend>("Friend", FriendSchema);
