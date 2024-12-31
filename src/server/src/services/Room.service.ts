import { Sequelize } from "sequelize-typescript";
import Room from "../models/Room";
import RoomMember from "../models/RoomMember";
import User from "../models/User";
import { attributesUser } from "./User.service";
import fs from "fs";
import RoomSong from "../models/RoomSong";
import { SortOptions } from "../utils/commonUtils";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import Song from "../models/Song";
import { songQueryOptions } from "./Song.service";

interface GetAllOptions {
  page: number;
  limit: number;
  userId?: string;
  sort?: SortOptions;
  keyword?: string;
  where?: WhereOptions;
}

export const attributesRoom = [
  "id",
  "title",
  "description",
  "imagePath",
  "userId",
  "createdAt",
  "updatedAt",
];

export default class RoomService {
  static options = [
    {
      model: User,
      as: "creator",
      attributes: attributesUser,
    },
    // {
    //   model: User,
    //   as: "members",
    //   attributes: attributesUser,
    //   through: { attributes: [] as never[] },
    // },
  ];

  static getAll = async () => {
    return await Room.findAll({
      attributes: [
        ...attributesRoom,
        [
          Sequelize.literal(
            `( SELECT COUNT(*) FROM room_members WHERE room_members.roomId = Room.id)`
          ),
          "membersCount",
        ],
        [
          Sequelize.literal(
            `( SELECT COUNT(*) FROM room_song WHERE room_song.roomId = Room.id)`
          ),
          "songsCount",
        ],
      ],
      include: this.options,
    });
  };

  static getAllWithPagination = async ({
    page = 1,
    limit = 10,
    userId,
    sort,
    keyword,
    where,
  }: GetAllOptions) => {
    const offset = (page - 1) * limit;

    const whereCondition: { [Op.and]?: any[] } = {};

    if (keyword) {
      whereCondition[Op.and] = whereCondition[Op.and] || [];
      whereCondition[Op.and].push({
        [Op.or]: [
          { title: { [Op.substring]: keyword } },
          { description: { [Op.substring]: keyword } },
        ],
      });
    }

    const order: any[] = [["createdAt", "DESC"]];

    if (sort) {
      switch (sort) {
        case "newest":
          order[0] = ["createdAt", "DESC"];
          break;
        case "oldest":
          order[0] = ["createdAt", "ASC"];
          break;
        case "mostListens":
          order[0] = [[Sequelize.literal("membersCount"), "DESC"]];
          break;
        default:
          order[0] = ["createdAt", "DESC"];
          break;
      }
    }

    const totalItems = await Room.count({
      where: {
        [Op.and]: [whereCondition, where],
      },
    });

    const rooms = await Room.findAndCountAll({
      where: {
        [Op.and]: [whereCondition, where],
      },
      attributes: [
        ...attributesRoom,
        [
          Sequelize.literal(
            `( SELECT COUNT(*) FROM room_members WHERE room_members.roomId = Room.id)`
          ),
          "membersCount",
        ],
        [
          Sequelize.literal(
            `( SELECT COUNT(*) FROM room_song WHERE room_song.roomId = Room.id)`
          ),
          "songsCount",
        ],
      ],
      include: this.options,
      limit,
      offset,
      order,
    });

    return {
      data: rooms.rows,
      sort: sort || "newest",
      keyword: keyword || "",
      user: userId || "",
      limit: limit,
      totalItems: totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  };

  static getById = (id: string) => {
    return Room.findByPk(id, {
      attributes: [
        ...attributesRoom,
        [
          Sequelize.literal(
            `( SELECT COUNT(*) FROM room_members WHERE room_members.roomId = Room.id)`
          ),
          "membersCount",
        ],
        [
          Sequelize.literal(
            `( SELECT COUNT(*) FROM room_song WHERE room_song.roomId = Room.id)`
          ),
          "songsCount",
        ],
      ],
      include: this.options,
    });
  };

  static create = async (data: Partial<Room>) => {
    return await Room.create(data);
  };

  static update = async (id: string, roomData: Partial<Room>) => {
    if (roomData.imagePath) {
      const oldRoom = await Room.findByPk(id);
      const imageOldRoom = oldRoom?.imagePath;
      if (imageOldRoom) {
        try {
          fs.unlinkSync(`./uploads/images/${imageOldRoom}`);
        } catch (error) {
          console.error("Error when delete old image:", error);
        }
      }
    }

    return Room.update(roomData, { where: { id } });
  };

  static delete = async (id: string) => {
    const RoomOld = await Room.findByPk(id);

    if (RoomOld) {
      const imagePath = RoomOld.imagePath;
      if (imagePath) {
        try {
          fs.unlinkSync(`./uploads/images/${imagePath}`);
        } catch (error) {
          console.error("Error when delete image:", error);
        }
      }
    }
    return await Room.destroy({ where: { id } });
  };
}
