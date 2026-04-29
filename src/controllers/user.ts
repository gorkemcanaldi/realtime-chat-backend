import { Request, response, Response } from "express";
import {
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
} from "../validation/user";
import { loginUser, registerUser } from "../services/user";

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
  const data = await loginUser(userData);

  res.cookie("accessToken", data, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).send({
    message: "login successful",
    status: 200,
  });
};

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).send({
    message: "logout successful",
  });
};
