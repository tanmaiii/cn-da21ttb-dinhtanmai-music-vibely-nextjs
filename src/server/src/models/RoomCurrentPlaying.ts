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

@Table({
  tableName: "room_current_playing",
  modelName: "RoomCurrentPlaying",
  timestamps: true,
  indexes: [],
})
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
    allowNull: true,
  })
  userId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  })
  startedAt!: Date; // Thời gian bắt đầu phát
}

export default RoomCurrentPlaying;
