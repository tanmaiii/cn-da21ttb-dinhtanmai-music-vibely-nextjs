import {
  BeforeCreate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { formatStringToSlug } from "../utils/commonUtils";
import { SIZE } from "../utils/contants";
import Genre from "./Genre";
import Mood from "./Mood";
import PlaylistMood from "./PlaylistMood";
import User from "./User";
import Song from "./Song";
import PlaylistSong from "./PlaylistSong";
import PlaylistLikes from "./PlaylistLikes";

//declare :// Khai báo thuộc tính mà không cần gán giá trị ngay lập tức
// "!" : thuộc tính không bao giờ là null
@Table({
  timestamps: true,
  tableName: "playlists",
  modelName: "Playlist",
  paranoid: true, // Cho phép xóa mềm
})
class Playlist extends Model {
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

  // Mô tả bài hát
  @Column({
    type: DataType.STRING(SIZE.DESCRIPTION),
  })
  declare description: string;

  @Column
  imagePath: string;

  @Column
  declare slug: string; // Đường dẫn bài hát

  @Column({
    defaultValue: true,
  })
  declare public: boolean;

  // Khóa ngoại

  @ForeignKey(() => Genre) //Khóa ngoại thể loại
  genreId: string;

  @ForeignKey(() => User) //Khóa ngoại người dùng
  userId: string;

  // Liên kết các bảng
  @BelongsTo(() => Genre) //Thuộc về thể loại nào
  genre: Genre;

  @BelongsTo(() => User) //Thuộc về người dùng nào
  creator: User;

  @BelongsToMany(() => Mood, () => PlaylistMood)
  moods: Mood[];

  @BelongsToMany(() => Song, () => PlaylistSong)
  songs: Song[];

  @BelongsToMany(() => User, () => PlaylistLikes)
  users: User[];

  @BeforeCreate // trước khi tạo
  static async addSlug(instance: Song) {
    const count = await Playlist.count({ where: { title: instance.title } });
    let suffix = "";

    if (count > 0) {
      suffix = "-" + `${count + 1}`;
    }

    instance.slug =
      formatStringToSlug(instance.title).replace(/ /g, "-") + suffix;
  }
}

export default Playlist;
