import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import Song from "./Song";
import Playlist from "./Playlist";
import { SIZE } from "../utils/contants";

@Table({
  tableName: "genres",
  modelName: "Genre",
   
  timestamps: true,
})
class Genre extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(SIZE.TITLE),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING(SIZE.DESCRIPTION),
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare imagePath: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare color: string;

  @HasMany(() => Song) // Một thể loại có nhiều bài hát
  declare songs: Song[];

  @HasMany(() => Playlist) // Một thể loại có nhiều playlist
  declare playlists: Playlist[];
}

export default Genre;
