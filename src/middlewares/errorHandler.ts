import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { isHttpError } from "http-errors";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (isHttpError(err)) {
    return res.status(err.status).send({
      message: err.message,
      status: err.status,
    });
  }
  if (err instanceof ZodError) {
    return res.status(400).send({
      message: "Validation error",
      errors: err.issues.map((e) => e.message),
      status: 400,
    });
  }

  res.status(500).send({
    message: err instanceof Error ? err.message : "server error",
    status: 500,
  });
};
