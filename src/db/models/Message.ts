import { Schema, model } from "mongoose";
import { IMessage } from "../../types/message";

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "file"], required: true },
  },
  {
    timestamps: true,
  },
);
export const MessageModel = model<IMessage>("Message", messageSchema);
