import createHttpError from "http-errors";
import { usernameModel } from "../db/models/Username";
import bcrypt from "bcrypt";
import { RegisterInput } from "../validation/username";

const registerUsername = async (data: RegisterInput) => {
  const { username, email, password } = data;
  const checkEmail = await usernameModel.findOne({ email });
  if (checkEmail) {
    throw createHttpError(409, "This email address was previously registered.");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await usernameModel.create({
    username,
    email,
    password: passwordHash,
  });
  const { password: _, ...safeUser } = user.toJSON();
  return safeUser;
};
