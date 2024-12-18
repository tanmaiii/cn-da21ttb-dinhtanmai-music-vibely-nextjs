import Mood from "../models/Mood";
import PlaylistMood from "../models/PlaylistMood";
import SongMood from "../models/SongMood";

export const attributesMood = ["id", "title", "description"];

export default class MoodService {
  static getMoods = () =>
    Mood.findAll({
      attributes: attributesMood,
    });

  static getMoodById = (id: string) => Mood.findByPk(id);

  static createMood = (mood: Partial<Mood>) => Mood.create(mood);

  static updateMood = (id: string, mood: Partial<Mood>) => {
    return Mood.update(mood, { where: { id } });
  };

  static deleteMood = (id: string) => Mood.destroy({ where: { id } });

  static addSongToMood = async (songId: string, moodIds: string[]) => {
    const SongMoods = await Promise.all(
      moodIds.map(async (moodId) => {
        const mood = await MoodService.getMoodById(moodId);
        if (mood === null) return null;
        return {
          songId,
          moodId,
        };
      })
    ).then((results) => results.filter((result) => result !== null));
    return SongMood.bulkCreate(SongMoods);
  };

  static addPlaylistToMood = async (playlistId: string, moodIds: string[]) => {
    const playlistMood = await Promise.all(
      moodIds.map(async (moodId) => {
        const mood = await MoodService.getMoodById(moodId);
        if (mood === null) return null;
        return {
          playlistId,
          moodId,
        };
      })
    ).then((results) => results.filter((result) => result !== null));
    return PlaylistMood.bulkCreate(playlistMood);
  };

  static updateSongToMood = async (songId: string, moodIds: string[]) => {
    await SongMood.destroy({ where: { songId } });
    return MoodService.addSongToMood(songId, moodIds);
  };

  static updatePlaylistToMood = async (
    playlistId: string,
    moodIds: string[]
  ) => {
    await PlaylistMood.destroy({ where: { playlistId } });
    return MoodService.addPlaylistToMood(playlistId, moodIds);
  };
}
