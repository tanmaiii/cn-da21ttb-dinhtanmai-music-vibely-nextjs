import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Room from "./Room";
import Song from "./Song";

@Table({
  tableName: "room_playlists",
  timestamps: true,
})
class RoomPlaylist extends Model {
  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  roomId!: string;

  @ForeignKey(() => Song)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  songId!: string;

  @BelongsTo(() => Room)
  room: Room;

  @BelongsTo(() => Song)
  song!: Song;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0, // Vị trí của bài hát trong danh sách
  })
  order!: number;
}

export default RoomPlaylist;
