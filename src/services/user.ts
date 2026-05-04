import createHttpError from "http-errors";
import { userModel } from "../db/models/User";
import bcrypt from "bcrypt";
import { LoginInput, RegisterInput } from "../validation/user";
import jwt from "jsonwebtoken";

export const registerUser = async (data: RegisterInput) => {
  const { username, email, password } = data;
  const checkEmail = await userModel.findOne({ email });
  if (checkEmail) {
    throw createHttpError(409, "This email address was previously registered.");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: passwordHash,
  });
  return user;
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw createHttpError(404, "user not found.");
  }
  const passwordControl = await bcrypt.compare(password, user.password);
  if (!passwordControl) {
    throw createHttpError(400, "incorrect password.");
  }
  const accessToken = jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "30m" },
  );

  const refreshToken = jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "24h",
    },
  );

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshUser = async (token: string) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string,
  ) as { id: string };

  const user = await userModel.findById(decoded.id);

  if (!user) throw createHttpError(404, "user not found");
  const accessToken = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" },
  );
  return accessToken;
};
