import { Sequelize } from "sequelize";
import Room from "../models/Room";
import RoomMember from "../models/RoomMember";
import User from "../models/User";
import { attributesUser } from "./User.service";
import fs from "fs";
import RoomSong from "../models/RoomSong";

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

  static create = async (data: any) => {
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

  static checkSongInRoom = async (roomId: string, songId: string) => {
    const songInRoom = await RoomSong.findOne({ where: { roomId, songId } });
    return !!songInRoom;
  };

  static addSongToRoom = async (roomId: string, songIds: string[]) => {
    const room = await Room.findByPk(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const roomIndex = await RoomSong.findAll({
      where: { roomId },
      attributes: [[Sequelize.fn("MAX", Sequelize.col("index")), "maxIndex"]],
    });

    const length = roomIndex[0]?.getDataValue("maxIndex") || 0;

    let index = length || 0;
    const songData = [];
    for (const songId of songIds) {
      index = index + 1;

      if (await this.checkSongInRoom(roomId, songId)) {
        continue;
      }

      songData.push({ roomId, songId, index });
    }

    return songData.length > 0 && (await RoomSong.bulkCreate(songData));
  };

  static updateSongToRoom = async (roomId: string, songIds: string[]) => {
    await RoomSong.destroy({ where: { roomId } });
    return await RoomService.addSongToRoom(roomId, songIds);
  };

  static removeSongToRoom = async (roomId: string, songIds: string[]) => {
    return songIds.map(async (songId) => {
      await RoomSong.destroy({ where: { roomId, songId } });
    });
  };
}
