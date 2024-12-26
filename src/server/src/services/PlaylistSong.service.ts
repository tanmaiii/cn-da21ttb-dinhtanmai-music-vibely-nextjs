import { Op } from "sequelize";
import PlaylistSong from "../models/PlaylistSong";
import Song from "../models/Song";
import { songQueryOptions } from "./Song.service";

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
        id: {
          [Op.in]: orderedSongIds,
        },
        ...whereCondition,
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
    return await PlaylistSong.findOne({ where: { playlistId, songId } });
  };

  static addSong = async (playlistSong: Partial<PlaylistSong>) => {
    const lastSong = await PlaylistSong.findOne({
      where: { playlistId: playlistSong.playlistId },
      order: [["index", "DESC"]],
    });

    const newIndex = lastSong ? lastSong.index + 1 : 1;
    return PlaylistSong.create({ ...playlistSong, index: newIndex });
  };

  static removeSong = (playlistSong: Partial<PlaylistSong>) =>
    PlaylistSong.destroy({ where: playlistSong });
}
