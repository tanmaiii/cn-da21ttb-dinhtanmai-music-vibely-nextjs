import {
  BeforeCreate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { formatStringToSlug } from "../utils/commonUtils";
import Follows from "./Follows";
import Playlist from "./Playlist";
import PlaylistLikes from "./PlaylistLikes";
import Roles from "./Roles";
import Room from "./Room";
import RoomChat from "./RoomChat";
import Song from "./Song";
import SongPlays from "./SongPlay";

@Table({
  timestamps: true,
  modelName: "User",
  tableName: "users",
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column
  declare name: string;

  @Column({
    unique: true,
  })
  declare slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public email: string;

  @Column({
    type: DataType.STRING,
  })
  declare imagePath: string;

  // Khóa ngoại
  @ForeignKey(() => Roles)
  roleId!: string;

  // Liên kết với các bảng
  @BelongsTo(() => Roles) //Thuộc 1 thể loại nào
  role: Roles;

  @HasMany(() => Song)
  songs: Song[];

  @BelongsToMany(() => Playlist, () => PlaylistLikes)
  likedPlaylists!: Playlist[];

  @HasMany(() => Room)
  rooms: Room[];

  @HasMany(() => RoomChat)
  roomChats: RoomChat[];

  @HasMany(() => SongPlays)
  plays!: SongPlays[];

  // Người dùng này đang theo dõi ai (followerId)
  @HasMany(() => Follows, "followerId")
  following!: Follows[];

  // Những ai đang theo dõi người dùng này (followingId)
  @HasMany(() => Follows, "followingId")
  followers!: Follows[];

  @BeforeCreate // trước khi tạo
  static async addSlug(instance: User) {
    const count = await User.count({ where: { name: instance.name } });
    let suffix = "";

    if (count > 0) {
      suffix = "-" + `${count + 1}`;
    }

    instance.slug =
      formatStringToSlug(instance.name).replace(/ /g, "-") + suffix;
  }
}

export default User;
