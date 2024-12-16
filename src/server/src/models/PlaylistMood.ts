import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Mood from "./Mood";
import Playlist from "./Playlist";

@Table({ tableName: "playlist_mood", modelName: "PlaylistMood" })
class PlaylistMood extends Model {
  @ForeignKey(() => Playlist)
  @Column
  playlistId!: number;

  @ForeignKey(() => Mood)
  @Column
  moodId!: number;
}

export default PlaylistMood;
