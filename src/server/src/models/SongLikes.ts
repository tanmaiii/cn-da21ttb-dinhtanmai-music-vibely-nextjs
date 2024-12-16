import {
  ForeignKey,
  Model,
  Table
} from "sequelize-typescript";
import Song from "./Song";
import User from "./User";

@Table({ tableName: "song_likes", modelName: "SongLikes", timestamps: true })
class SongLikes extends Model {
  @ForeignKey(() => Song)
  songId!: string;

  @ForeignKey(() => User)
  userId!: string;
}

export default SongLikes;
