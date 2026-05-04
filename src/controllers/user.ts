import { Request, Response } from "express";
import {
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
} from "../validation/user";
import { loginUser, refreshUser, registerUser } from "../services/user";

export const registerController = async (req: Request, res: Response) => {
  const userData: RegisterInput = registerSchema.parse(req.body);
  const data = await registerUser(userData);
  const { password: _, ...safeUser } = data.toJSON();

  return res.status(201).send({
    message: "user registration successful",
    status: 201,
    safeUser,
  });
};

export const loginController = async (req: Request, res: Response) => {
  const userData: LoginInput = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await loginUser(userData);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).send({
    message: "login successful",
    status: 200,
    user,
  });
};

export const refreshController = async (req: Request, res: Response) => {
  const cookie = req.cookies?.refreshToken;
  const data = await refreshUser(cookie);

  return res.status(200).send({ accessToken: data });
};

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).send({
    message: "logout successful",
  });
};
