import {
  BeforeCreate,
  BeforeUpdate,
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
import { SIZE } from "../utils/contants";
import Genre from "./Genre";
import Mood from "./Mood";
import Playlist from "./Playlist";
import PlaylistSong from "./PlaylistSong";
import SongLikes from "./SongLikes";
import SongMood from "./SongMood";
import User from "./User";
import SongPlay from "./SongPlay";
import Room from "./Room";
import RoomSong from "./RoomSong";

//declare :// Khai báo thuộc tính mà không cần gán giá trị ngay lập tức
// "!" : thuộc tính không bao giờ là null

//@belongsTo : quan gệ 1 - * ( 1 bài hát thuộc 1 thể loại)
//@belongsToMany : quan hệ nhiều - nhiều ( 1 bài hát thuộc nhiều tâm trạng)
//@HasMany : quan hệ 1 - nhiều ( 1 thể loại có nhiều bài hát)
//@beforeCreate : trước khi tạo
//@Column : cột trong database

@Table({
  timestamps: true,
  tableName: "songs",
  modelName: "Song",
  paranoid: true, // Cho phép xóa mềm
})
class Song extends Model {
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

  // Đường dẫn bài hát
  @Column({
    unique: true,
  })
  declare slug: string;

  //Thời lượng bài hát
  @Column
  declare duration: number;

  // Đường dẫn bài hát
  @Column({
    // allowNull: false,
  })
  declare songPath: string;

  @Column
  declare imagePath: string;

  @Column
  declare lyricPath: string;

  @Column({
    defaultValue: true,
  })
  declare public: boolean;

  @ForeignKey(() => Genre) //Khóa ngoại thể loại
  genreId: string;

  @ForeignKey(() => User) //Khóa ngoại thể loại
  @Column({
    allowNull: true,
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => Genre) //Thuộc 1 thể loại
  genre: Genre;

  @BelongsTo(() => User)
  creator: User; // Người tạo

  @BelongsToMany(() => Mood, () => SongMood)
  moods!: Mood[];

  @BelongsToMany(() => Playlist, () => PlaylistSong)
  playlists!: Playlist[];

  @BelongsToMany(() => Room, () => RoomSong)
  rooms!: Room[];

  @HasMany(() => SongPlay)
  plays!: SongPlay[];

  @BelongsToMany(() => User, () => SongLikes)
  likes!: User[];

  @BeforeCreate // trước khi tạo
  static async addSlug(instance: Song) {
    const count = await Song.count({ where: { title: instance.title } });
    let suffix = "";

    if (count > 0) {
      suffix = "-" + `${count + 1}`;
    }

    instance.slug =
      formatStringToSlug(instance.title).replace(/ /g, "-") + suffix;
  }
}

export default Song;
