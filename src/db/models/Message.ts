import { Schema, model } from "mongoose";
import { IMessage } from "../../types/message";

const messageSchema = new Schema<IMessage>(
  {
    message: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
const MessageModel = model<IMessage>("Message", messageSchema);
export default MessageModel;
