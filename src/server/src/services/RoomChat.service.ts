import { WhereOptions } from "sequelize";
import Room from "../models/Room";
import RoomChat from "../models/RoomChat";
import User from "../models/User";
import { SortOptions } from "../utils/commonUtils";
import { attributesRoom } from "./Room.service";
import { attributesUser } from "./User.service";

interface GetAllOptions {
  page: number;
  limit: number;
  roomId: string;
  where?: WhereOptions;
}

export default class RoomChatService {
  static options = [
    {
      model: Room,
      as: "room",
      attributes: attributesRoom,
    },
    {
      model: User,
      as: "user",
      attributes: attributesUser,
    },
  ];

  static getAll = async () => {
    return await RoomChat.findAll({
      include: this.options,
    });
  };

  static getById = (id: string) => {
    return RoomChat.findByPk(id, { include: this.options });
  };

  static getChatByRoomId = async ({
    page = 1,
    limit = 10,
    roomId,
  }: GetAllOptions) => {
    const offset = (page - 1) * limit;

    const chats = await RoomChat.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: this.options,
      where: { roomId },
    });

    return {
      data: chats.rows,
      limit: limit,
      totalItems: chats.count,
      currentPage: page,
      totalPage: Math.ceil(chats.count / limit),
    };
  };

  static create = async (data: Partial<RoomChat>) => {
    return await RoomChat.create(data);
  };

  static delete = async (id: string) => {
    return await RoomChat.destroy({ where: { id } });
  };
}
