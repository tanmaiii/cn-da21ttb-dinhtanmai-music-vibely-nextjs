import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import { IIdentity } from "../middleware/auth.middleware";
import { CreateChatInput, GetChatInput } from "../schema/room_chat.schema";
import RoomService from "../services/Room.service";
import RoomChatService from "../services/RoomChat.service";
import ApiError from "../utils/ApiError";

export const getChatHandler = async (
  req: Request<GetChatInput["params"], GetChatInput["query"], {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);
    const { limit = 20, page = 1, keyword, sort } = req.query;

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room chat not found");
    }

    const chats = await RoomChatService.getChatByRoomId({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      roomId: req.params.id,
    });

    res.status(StatusCodes.OK).json({
      data: chats,
      message: "Get room chat successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createChatHandler = async (
  req: Request<CreateChatInput["params"], {}, CreateChatInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);
    const userInfo = get(req, "identity") as IIdentity;

    if (!room) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create room chat failed");
    }

    const data = {
      content: req.body.content,
      roomId: req.params.id,
      userId: userInfo.id,
    };

    const newChat = await RoomChatService.create(data);

    res.status(StatusCodes.CREATED).json({
      data: newChat,
      message: "Create room chat successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChatHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat = await RoomChatService.getById(req.params.id);

    if (!chat) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Chat not found");
    }

    await RoomChatService.delete(req.params.id);

    res.status(StatusCodes.OK).json({
      message: "Delete chat successfully",
    });
  } catch (error) {
    next(error);
  }
};
