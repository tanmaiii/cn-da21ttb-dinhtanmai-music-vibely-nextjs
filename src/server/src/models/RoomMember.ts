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
  tableName: "room_members",
  timestamps: true,
})
class RoomMember extends Model {
  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  roomId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false, // True nếu là chủ nhóm
  })
  isOwner!: boolean;

  @BelongsTo(() => Room)
  room: Room;

  @BelongsTo(() => User)
  user!: User;
}

export default RoomMember;
