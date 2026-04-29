import { model, Schema } from "mongoose";
import { IUser } from "../../types/user";

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

export const userModel = model<IUser>("User", usernameSchema);
