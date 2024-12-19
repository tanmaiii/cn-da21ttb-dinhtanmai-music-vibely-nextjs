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
  tableName: "room_song",
  timestamps: true,
})
class RoomSong extends Model {
  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  roomId!: string;

  @ForeignKey(() => Song)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  songId!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0, // Vị trí của bài hát trong danh sách
  })
  index!: number;

  @BelongsTo(() => Room)
  room: Room;

  @BelongsTo(() => Song)
  song!: Song;
}

export default RoomSong;
