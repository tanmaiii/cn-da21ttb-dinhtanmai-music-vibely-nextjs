import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Sequelize,
  Table
} from "sequelize-typescript";
import Song from "./Song";
import User from "./User";

@Table({
  tableName: "song_plays",
  modelName: "SongPlays",
  timestamps: false,
   
  indexes: [],
})
class SongPlays extends Model {
  @ForeignKey(() => Song)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  songId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => Song)
  song!: Song;

  @Column({
    type: DataType.DATE(6), // Độ chính xác microsecond
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"), // Thời gian mặc định là hiện tại
    allowNull: false,
  })
  playedAt!: Date;
}

// (async () => {
//   try {
//     await sequelize.query(`
//          ALTER TABLE song_plays DROP INDEX song_plays_songId_userId_unique;
//         `);
//   } catch (error) {
//     console.error("❌❌  Lỗi khi thêm khóa chính:");
//   }
// })();

export default SongPlays;