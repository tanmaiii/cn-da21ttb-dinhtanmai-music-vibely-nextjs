import { Op } from "sequelize";
import RoomMember from "../models/RoomMember";
import User from "../models/User";
import UserService from "./User.service";

interface GetAllOptions {
  page: number;
  limit: number;
  roomId?: string;
  sort?: any;
  keyword?: string;
  where?: any;
}

export default class RoomMemberService {
  static options = {};

  static getAllWithPagination = async ({
    page = 1,
    limit = 10,
    roomId,
    sort,
    keyword,
    where,
  }: GetAllOptions) => {
    const offset = (page - 1) * limit;

    const usersInRoom = await RoomMember.findAll({
      where: { roomId },
      attributes: ["userId", "createdAt"],
      order: [["createdAt", "ASC"]],
    });

    const whereCondition: { [Op.and]?: any[] } = {};

    if (keyword) {
      whereCondition[Op.and] = whereCondition[Op.and] || [];
      whereCondition[Op.and].push({
        [Op.or]: [{ name: { [Op.substring]: keyword } }],
      });
    }
    const orderedUserIds = usersInRoom.map((song) => song.userId);

    const totalItems = await User.count({
      where: {
        [Op.and]: [whereCondition, { id: { [Op.in]: orderedUserIds } }],
      },
    });

    const users = await User.findAll({
      where: {
        [Op.and]: [whereCondition, { id: { [Op.in]: orderedUserIds } }],
      },
      ...UserService.userQueryOptions,
      limit,
      offset,
      order: [["createdAt", "ASC"]],
    } as any);

    const orderedUsers = orderedUserIds
      .map((id) => users.find((user) => user.id === id))
      .filter((user) => user !== null && user !== undefined);

    return {
      data: orderedUsers,
      sort: sort || "newest",
      keyword: keyword || "",
      limit: limit,
      totalItems: totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  };

  static checkUserToRoom = async (roomId: string, userId: string) => {
    const userInRoom = await RoomMember.findOne({ where: { roomId, userId } });
    return !!userInRoom;
  };

  static addUserToRoom = async (roomId: string, userId: string) => {
    return await RoomMember.create({ roomId, userId });
  };

  static removeUserToRoom = async (roomId: string, userId: string) => {
    return RoomMember.destroy({ where: { roomId, userId } });
  };
}
