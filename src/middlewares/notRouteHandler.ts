import { Request, Response } from "express";

export const notRouteHandler = (req: Request, res: Response) => {
  res.status(404).send({
    status: 404,
    message: "Route not found",
  });
};
