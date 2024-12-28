import { Op, Sequelize } from "sequelize";
import PlaylistSong from "../models/PlaylistSong";
import Song from "../models/Song";
import SongService, { songQueryOptions } from "./Song.service";

export default class PlaylistSongService {
  static getAll = async (playlistId: string, userId?: string) => {
    const whereCondition: any = userId
      ? {
          [Op.or]: [{ public: true }, { userId }],
        }
      : { public: true };

    const songsInPlaylist = await PlaylistSong.findAll({
      where: { playlistId },
      attributes: ["songId", "index"],
      order: [["index", "ASC"]],
    });

    // Lấy danh sách songId theo thứ tự đã sắp xếp
    const orderedSongIds = songsInPlaylist.map((song) => song.songId);

    // Truy vấn bảng Songs với điều kiện lọc theo id và thứ tự từ orderedSongIds
    const songs = await Song.findAll({
      where: {
        [Op.and]: [whereCondition, { id: { [Op.in]: orderedSongIds } }],
      },
      attributes: songQueryOptions.attributes as string[],
      include: songQueryOptions.include,
    });

    // Sắp xếp kết quả trả về theo thứ tự trong orderedSongIds
    const orderedSongs = orderedSongIds.map((id) =>
      songs.find((song) => song.id === id)
    );

    return orderedSongs;
  };

  static checkSongInPlaylist = async (playlistId: string, songId: string) => {
    const song = await PlaylistSong.findOne({ where: { playlistId, songId } });
    return !!song;
  };

  static addSong = async (playlistId: string, songIds: string[]) => {
    // Lấy index lớn nhất hiện tại
    const playlistIndex = await PlaylistSong.findAll({
      where: { playlistId },
      attributes: [[Sequelize.fn("MAX", Sequelize.col("index")), "maxIndex"]],
    });

    // Nếu không có index thì gán index = 0
    const length = playlistIndex[0]?.getDataValue("maxIndex") || 0;

    let index = length || 0;
    const songData = [];

    for (const songId of songIds) {
      index = index + 1;

      if (
        (await this.checkSongInPlaylist(playlistId, songId)) ||
        !(await SongService.getSongById(songId))
      ) {
        continue; // Nếu bài hát đã tồn tại trong playlist thì bỏ qua
      }

      songData.push({ playlistId, songId, index });
    }

    return PlaylistSong.bulkCreate(songData);
  };

  static updateSong = async (playlistId: string, songIds: string[]) => {
    await PlaylistSong.destroy({ where: { playlistId } });
    return this.addSong(playlistId, songIds);
  };

  static removeSong = async (playlistId: string, songIds: string[]) => {
    for (const songId of songIds) {
      if (!(await this.checkSongInPlaylist(playlistId, songId))) {
        continue;
      }

      await PlaylistSong.destroy({ where: { playlistId, songId } });
    }
  };
}
