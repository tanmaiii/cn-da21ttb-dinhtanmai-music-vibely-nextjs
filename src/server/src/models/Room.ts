import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { SIZE } from "../utils/contants";
import RoomMember from "./RoomMember";
import RoomPlaylist from "./RoomSong";
import RoomChat from "./RoomChat";
import User from "./User";
import RoomCurrentPlaying from "./RoomCurrentPlaying";
import Song from "./Song";

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

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  declare imagePath: string;

  @ForeignKey(() => User) //Khóa ngoại thể loại
  @Column({
    allowNull: true,
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => User)
  creator: User; // Người tạo

  @BelongsToMany(() => User, () => RoomMember)
  members!: RoomMember[];

  @HasMany(() => RoomPlaylist)
  playlists!: RoomPlaylist[];

  @HasMany(() => RoomChat)
  chats!: RoomChat[];

  @BelongsToMany(() => Song, () => RoomCurrentPlaying)
  currentPlaying!: RoomCurrentPlaying;
}

export default Room;
