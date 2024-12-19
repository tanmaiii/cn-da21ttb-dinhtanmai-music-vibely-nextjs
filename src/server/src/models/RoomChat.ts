import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Room from "./Room";
import User from "./User";

@Table({
  tableName: "room_chat",
  timestamps: true,
})
class RoomChat extends Model {
  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  roomId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @BelongsTo(() => Room)
  room: Room;

  @BelongsTo(() => User)
  user!: User;
}

export default RoomChat;
