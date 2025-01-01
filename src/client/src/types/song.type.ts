import { IArtist, IGenre, IMood } from ".";

export default interface ISong {
  id: string;
  title: string;
  slug?: string; // URL
  description: string;
  imagePath?: string;
  songPath: string;
  lyricPath?: string;
  genre?: IGenre; // Thể loại
  owner: IArtist[]; // Tác giả
  creator: IArtist; // Người tạo
  createdAt: string;
  duration: string; // 00:00
  public: boolean; // Công khai
  number?: number; // Số thứ tự trong playlist
  listens: number; // Lượt nghe
  likes: number; // Lượt thích
  moods?: IMood[]; // Tâm trạng
}