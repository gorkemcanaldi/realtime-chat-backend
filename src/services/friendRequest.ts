import createHttpError from "http-errors";
import { userModel } from "../db/models/User";
import { FriendRequestModel } from "../db/models/FriendRequest";
import { FriendModel } from "../db/models/Friend";

export const sendFriendRequest = async (
  senderId: string,
  receiverId: string,
) => {
  if (senderId === receiverId) {
    throw createHttpError(400, "You cannot send a friend request to yourself");
  }

  const receiver = await userModel.findById(receiverId);

  if (!receiver) {
    throw createHttpError(404, "User not found");
  }

  const alreadyFriend = await FriendModel.findOne({
    $or: [
      { userId: senderId, friendId: receiverId },
      { userId: receiverId, friendId: senderId },
    ],
  });

  if (alreadyFriend) {
    throw createHttpError(409, "You are already friends");
  }

  const existingRequest = await FriendRequestModel.findOne({
    $or: [
      { senderId, receiverId, status: "pending" },
      { senderId: receiverId, receiverId: senderId, status: "pending" },
    ],
  });

  if (existingRequest) {
    throw createHttpError(409, "Friend request already sent");
  }

  const request = await FriendRequestModel.create({
    senderId,
    receiverId,
    status: "pending",
  });

  return request;
};

export const acceptFriendRequest = async (
  requestId: string,
  userId: string,
) => {
  const request = await FriendRequestModel.findById(requestId);
  if (!request) {
    throw createHttpError(404, "Request not found");
  }

  if (request.receiverId.toString() !== userId) {
    throw createHttpError(403, "Not allowed");
  }
  if (request.status === "accepted") {
    throw createHttpError(409, "Already accepted");
  }
  request.status = "accepted";
  await request.save();

  await FriendModel.create({
    userId: request.senderId,
    friendId: request.receiverId,
  });

  await FriendModel.create({
    userId: request.receiverId,
    friendId: request.senderId,
  });
  return { message: "Friend request accepted", request };
};

export const rejectFriendRequest = async (
  requestId: string,
  userId: string,
) => {
  const request = await FriendRequestModel.findById(requestId);
  if (!request) {
    throw createHttpError(404, "Request not found");
  }

  if (request.receiverId.toString() !== userId) {
    throw createHttpError(403, "Not allowed");
  }
  if (request.status !== "pending") {
    throw createHttpError(409, "Request already processed");
  }

  request.status = "rejected";
  await request.save();
  return {
    message: "Friend request rejected",
  };
};
