import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { SIZE } from "../utils/contants";
import RoomMember from "./RoomMember";
import RoomPlaylist from "./RoomPlaylist";
import RoomChat from "./RoomChat";

@Table({
  tableName: "rooms",
  timestamps: true,
})
class Room extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // Tiêu đề bài hát
  @Column({
    allowNull: false,
    type: DataType.STRING(SIZE.TITLE),
  })
  declare title: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(SIZE.DESCRIPTION),
  })
  description!: string;

  @HasMany(() => RoomMember)
  members!: RoomMember[];

  @HasMany(() => RoomPlaylist)
  playlists!: RoomPlaylist[];

  @HasMany(() => RoomChat)
  chats!: RoomChat[];
}

export default Room;
