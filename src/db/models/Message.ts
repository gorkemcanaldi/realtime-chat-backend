import { Schema, model } from "mongoose";
import { IMessage } from "../../types/message";

const messageSchema = new Schema<IMessage>(
  {
    message: { type: String, required: true },
    username: { type: String },
  },
  {
    timestamps: true,
  },
);

export default model<IMessage>("Message", messageSchema);
