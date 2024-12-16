import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import Song from "./Song";
import SongMood from "./SongMood";
import Playlist from "./Playlist";
import PlaylistMood from "./PlaylistMood";

@Table({ tableName: "moods", modelName: "Mood",   timestamps: true })
class Mood extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    allowNull: false,
  })
  declare title: string;

  @Column
  declare description: string;

  @BelongsToMany(() => Song, () => SongMood)
  songs!: Song[];

  @BelongsToMany(() => Playlist, () => PlaylistMood)
  playlists!: Playlist[];
}


export default Mood;


export const getMoods = () => Mood.findAll();
export const getMoodById = (id: string) => Mood.findByPk(id);
export const createMood = (mood: Partial<Mood>) => Mood.create(mood);
export const updateMood = (id: string, mood: Mood) =>
  Mood.update(mood, { where: { id } });
export const deleteMood = (id: string) => Mood.destroy({ where: { id } });
