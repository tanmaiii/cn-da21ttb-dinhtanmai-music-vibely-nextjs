import { StatusCodes } from "http-status-codes";
import RoomService from "../services/Room.service";
import { NextFunction, Request, Response } from "express";
import {
  AddMemberToRoomInput,
  AddSongToRoomInput,
  CreateRoomInput,
  GetAllRoomInput,
  GetRoomSchema,
  RemoveMemberToRoomInput,
  RemoveSongToRoomInput,
  UpdateRoomInput,
} from "../schema/room.schema";
import ApiError from "../utils/ApiError";
import { get } from "lodash";
import { getFilePath } from "../utils/commonUtils";
import { IIdentity } from "../middleware/auth.middleware";
import RoomSongService from "../services/RoomSong.service";

export const getAllRoomsHandler = async (
  req: Request<{}, GetAllRoomInput["query"], {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10, page = 1, keyword, sort } = req.query;
    const userInfo = get(req, "identity") as IIdentity;

    const rooms = await RoomService.getAllWithPagination({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: sort as any,
      userId: userInfo.id,
      keyword: keyword as string,
    });

    res
      .status(StatusCodes.OK)
      .json({ data: rooms, message: "Get all room successfully" });
  } catch (error) {
    next(error);
  }
};

export const getDetailRoomHandler = async (
  req: Request<GetRoomSchema["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);

    if (!room) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ data: room, message: "Get room detail successfully" });
  } catch (error) {
    next(error);
  }
};

export const createRoomHandler = async (
  req: Request<{}, {}, CreateRoomInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as { id: string };

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const songIds = req.body.songId;

    const data = {
      ...req.body,
      userId: userInfo.id,
      ...(getFilePath(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
    };

    const room = await RoomService.create(data);

    if (songIds) {
      await RoomSongService.addSongToRoom(room.id, songIds);
    }

    const newRoom = await RoomService.getById(room.id);

    res
      .status(StatusCodes.CREATED)
      .json({ data: newRoom, message: "Create room successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateRoomHandler = async (
  req: Request<UpdateRoomInput["params"], {}, UpdateRoomInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);
    const songIds = req.body.songId;

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const data = {
      ...req.body,
      ...(getFilePath(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
    };

    await RoomService.update(req.params.id, data);

    if (songIds) {
      await RoomSongService.updateSongToRoom(req.params.id, songIds);
    }

    const newRoom = await RoomService.getById(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ data: newRoom, message: "Update room successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteRoomHandler = async (
  req: Request<GetRoomSchema["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);
    const userInfo = get(req, "identity") as { id: string };

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
    }

    if (userInfo.id !== room.userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to delete this room"
      );
    }

    await RoomService.delete(req.params.id);

    res.status(StatusCodes.OK).json({ message: "Delete room successfully" });
  } catch (error) {
    next(error);
  }
};

// Thêm bài hát vào phòng
export const addSongToRoomHandler = async (
  req: Request<AddSongToRoomInput["params"], {}, AddSongToRoomInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);
    const userInfo = get(req, "identity") as IIdentity;

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
    }

    if (userInfo.id !== room.userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to add song to this room"
      );
    }

    const songIds = req.body.songId;

    await RoomSongService.addSongToRoom(req.params.id, songIds);

    res
      .status(StatusCodes.OK)
      .json({ message: "Add song to room successfully" });
  } catch (error) {
    next(error);
  }
};

//Xóa bài hát khỏi phòng
export const removeSongToRoomHandler = async (
  req: Request<
    RemoveSongToRoomInput["params"],
    {},
    RemoveSongToRoomInput["body"]
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);
    const userInfo = get(req, "identity") as IIdentity;

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
    }

    if (userInfo.id !== room.userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to remove song to this room"
      );
    }

    const songIds = req.body.songId;

    if (songIds && songIds.length > 0) {
      await RoomSongService.removeSongToRoom(req.params.id, songIds);
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Remove song to room successfully" });
  } catch (error) {
    next(error);
  }
};

export const getSongsInRoomHandler = async (
  req: Request<GetRoomSchema["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
    }

    const songs = await RoomSongService.getSongInRoom(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ data: songs, message: "Get songs in room successfully" });
  } catch (error) {
    next(error);
  }
};

// Thêm thành viên vào phòng
export const addMemberToRoomHandler = async (
  req: Request<
    AddMemberToRoomInput["params"],
    {},
    AddMemberToRoomInput["body"]
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
    }

    const MemberExist = await RoomService.checkUserToRoom(
      req.params.id,
      req.body.userId
    );

    if (MemberExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Member already exist in room");
    }

    await RoomService.addUserToRoom(req.params.id, req.body.userId);

    res
      .status(StatusCodes.OK)
      .json({ message: "Add member to room successfully" });
  } catch (error) {
    next(error);
  }
};

//Xóa thành viên khỏi phòng
export const removeMemberToRoomHandler = async (
  req: Request<
    RemoveMemberToRoomInput["params"],
    {},
    RemoveMemberToRoomInput["body"]
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await RoomService.getById(req.params.id);

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
    }

    const MemberExist = await RoomService.checkUserToRoom(
      req.params.id,
      req.body.userId
    );

    if (!MemberExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Member not found in room");
    }

    await RoomService.removeUserToRoom(req.params.id, req.body.userId);

    res
      .status(StatusCodes.OK)
      .json({ message: "Remove member to room successfully" });
  } catch (error) {
    next(error);
  }
};
