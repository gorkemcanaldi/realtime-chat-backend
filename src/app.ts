import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoDB from "./db/mongoDB";
import userRouter from "./routes/user";
import { initServer } from "./sockets/socket";
import { notRouteHandler } from "./middlewares/notRouteHandler";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

dotenv.config();
mongoDB();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

initServer(io);
app.use("/user", userRouter);

app.use(notRouteHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
