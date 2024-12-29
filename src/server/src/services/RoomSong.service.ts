import { Sequelize } from "sequelize";
import Room from "../models/Room";
import RoomSong from "../models/RoomSong";
import Song from "../models/Song";
import RoomService from "./Room.service";
import SongService, { songQueryOptions } from "./Song.service";
import { Op } from "sequelize";

export default class RoomSongService {
  static getSongInRoom = async (roomId: string) => {
    const songsInRoom = await RoomSong.findAll({
      where: { roomId },
      attributes: ["songId", "index"],
      order: [["index", "ASC"]],
    });

    const orderedSongIds = songsInRoom.map((song) => song.songId);

    const songs = await Song.findAll({
      where: {
        id: {
          [Op.in]: orderedSongIds,
        },
        public: true, // chắc chắn bài hát phải được công khai
      },
      attributes: songQueryOptions.attributes as string[],
      include: songQueryOptions.include,
    });

    const orderedSongs = orderedSongIds.map((id) =>
      songs.find((song) => song.id === id)
    );

    return orderedSongs;
  };

  static checkSongInRoom = async (roomId: string, songId: string) => {
    const songInRoom = await RoomSong.findOne({ where: { roomId, songId } });
    return !!songInRoom;
  };

  static addSongToRoom = async (roomId: string, songIds: string[]) => {
    const room = await RoomService.getById(roomId);
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

      if (
        (await this.checkSongInRoom(roomId, songId)) ||
        !(await SongService.getSongById(songId))
      ) {
        continue;
      }

      songData.push({ roomId, songId, index });
    }

    return songData.length > 0 && (await RoomSong.bulkCreate(songData));
  };

  static updateSongToRoom = async (roomId: string, songIds: string[]) => {
    await RoomSong.destroy({ where: { roomId } });
    return await RoomSongService.addSongToRoom(roomId, songIds);
  };

  static removeSongToRoom = async (roomId: string, songIds: string[]) => {
    return songIds.map(async (songId) => {
      await RoomSong.destroy({ where: { roomId, songId } });
    });
  };
}