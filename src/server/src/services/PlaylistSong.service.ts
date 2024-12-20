import PlaylistSong from "../models/PlaylistSong";
import Song from "../models/Song";
import { songQueryOptions } from "./Song.service";

export default class PlaylistSongService {
  static getAll = async (playlistId: string) => {
    return PlaylistSong.findAll({
      where: { playlistId },
      include: [
        {
          model: Song,
          attributes: songQueryOptions.attributes as string[],
          include: songQueryOptions.include,
          order: [["index", "ASC"]],
        },
      ],
    });
  };

  static checkSongInPlaylist = async (playlistId: string, songId: string) => {
    return await PlaylistSong.findOne({ where: { playlistId, songId } });
  };

static addSong = async (playlistSong: Partial<PlaylistSong>) => {
    const lastSong = await PlaylistSong.findOne({
        where: { playlistId: playlistSong.playlistId },
        order: [['index', 'DESC']],
    });

    const newIndex = lastSong ? lastSong.index + 1 : 1;
    return PlaylistSong.create({ ...playlistSong, index: newIndex });
};

  static removeSong = (playlistSong: Partial<PlaylistSong>) =>
    PlaylistSong.destroy({ where: playlistSong });
}
