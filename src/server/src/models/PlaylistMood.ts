import {
  AllowNull,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Mood from "./Mood";
import Playlist from "./Playlist";

@Table({ tableName: "playlist_mood", modelName: "PlaylistMood" })
class PlaylistMood extends Model {
  @ForeignKey(() => Playlist)
  @Column({
    allowNull: true,
  })
  playlistId!: number;

  @ForeignKey(() => Mood)
  @Column({
    allowNull: true,
  })
  moodId!: number;
}

export default PlaylistMood;
