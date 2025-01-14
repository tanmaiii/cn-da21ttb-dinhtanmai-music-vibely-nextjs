import {
  Model,
  Sequelize,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from "sequelize-typescript";
import Room from "./Room";
import Song from "./Song";
import User from "./User";

@Table({ tableName: "room_current_playing", timestamps: true })
class RoomCurrentPlaying extends Model {
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  })
  startedAt!: Date; // Thời gian bắt đầu phát

  @BelongsTo(() => Room)
  room: Room;

  @BelongsTo(() => Song)
  song!: Song;
}

export default RoomCurrentPlaying;
