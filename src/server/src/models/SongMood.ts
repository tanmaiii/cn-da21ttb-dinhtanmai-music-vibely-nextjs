import { Model, Column, ForeignKey, Table } from "sequelize-typescript";
import Song from "./Song";
import Mood from "./Mood";

@Table({
  tableName: "song_mood",
  modelName: "SongMood",
   
  timestamps: false,
})
class SongMood extends Model {
  @ForeignKey(() => Song)
  @Column({ primaryKey: true, allowNull: false })
  songId!: string;

  @ForeignKey(() => Mood)
  @Column({ primaryKey: true, allowNull: false })
  moodId!: string;
}

export default SongMood;
