import { model, Schema } from "mongoose";
import { IUser } from "../../types/username";

const usernameSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
usernameSchema.index({ email: 1 }, { unique: true });

export const usernameModel = model<IUser>("User", usernameSchema);
