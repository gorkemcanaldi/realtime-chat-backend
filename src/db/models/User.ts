import { model, Schema } from "mongoose";
import { IUser } from "../../types/user";

const usernameSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true, select: false },
    lastSeen: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const userModel = model<IUser>("User", usernameSchema);
