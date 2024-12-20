import Follows from "../models/Follows";
import PlaylistLikes from "../models/PlaylistLikes";
import SongLikes from "../models/SongLikes";

export default class LikeService {
  //Song
  static getLikeSong = async (userId: string, songId: string) => {
    return await SongLikes.findOne({ where: { userId, songId } });
  };

  static likeSong = async (userId: string, songId: string) => {
    await SongLikes.create({ userId, songId });
  };

  static unLikeSong = async (userId: string, songId: string) => {
    const existLike = await SongLikes.findOne({ where: { userId, songId } });
    await existLike.destroy();
  };

  // Playlist
  static getLikePlaylist = async (userId: string, playlistId: string) => {
    return await PlaylistLikes.findOne({ where: { userId, playlistId } });
  };

  static likePlaylist = async (userId: string, playlistId: string) => {
    await PlaylistLikes.create({ userId, playlistId });
  };

  static unLikePlaylist = async (userId: string, playlistId: string) => {
    const existPlaylistLike = await PlaylistLikes.findOne({
      where: { userId, playlistId },
    });
    if (existPlaylistLike) await existPlaylistLike.destroy();
    return true;
  };

  // User
  static getFollow = async (userId: string, artistId: string) => {
    return await Follows.findOne({
      where: { followerId: userId, followingId: artistId },
    });
  };

  static follow = async (userId: string, artistId: string) => {
    return await Follows.create({ followerId: userId, followingId: artistId });
  };

  static unFollowArtist = async (userId: string, artistId: string) => {
    const existFollow = await Follows.findOne({
      where: { followerId: userId, followingId: artistId },
    });
    if (existFollow) await existFollow.destroy();
    return true;
  };
}
