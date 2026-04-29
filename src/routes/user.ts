import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/user";

const userRouter = Router();

userRouter.post("/register", ctrlWrapper(registerController));
userRouter.post("/login", ctrlWrapper(loginController));
userRouter.post("/logout", ctrlWrapper(logoutController));
export default userRouter;
