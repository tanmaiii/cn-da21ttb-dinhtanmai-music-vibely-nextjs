import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Playlist from "./Playlist";
import User from "./User";

@Table({ tableName: "playlist_likes", modelName: "PlaylistLikes",   })
class PlaylistLikes extends Model {
  @ForeignKey(() => Playlist)
  playlistId!: string;

  @ForeignKey(() => User)
  userId!: string;
}

export default PlaylistLikes;
