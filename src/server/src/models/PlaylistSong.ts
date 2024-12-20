import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Playlist from "./Playlist";
import Song from "./Song";

@Table({
  tableName: "playlist_song",
  modelName: "PlaylistSong",
  timestamps: false,
})
class PlaylistSong extends Model {
  @ForeignKey(() => Playlist)
  @Column
  playlistId!: string;

  @ForeignKey(() => Song)
  @Column
  songId!: string;

  @Column
  index: number;

  @BelongsTo(() => Song)
  song: Song;

  @BelongsTo(() => Playlist)
  playlist: Playlist;
}

export default PlaylistSong;
