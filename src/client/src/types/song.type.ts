import { IArtist, IGenre, IMood, ISort } from ".";

export interface QuerySongParams {
  page?: number;
  limit?: number;
  sort?: ISort;
  keyword?: string;
  genreId?: string;
}

export default interface ISong {
  id: string;
  title: string;
  slug?: string; // URL
  description: string;
  imagePath?: string;
  songPath: string;
  lyricPath?: string;
  genre?: IGenre; // Thể loại
  // owner: IArtist[]; // Tác giả
  creator: IArtist; // Người tạo
  createdAt: string;
  duration: number; // 00:00
  public: boolean; // Công khai
  number?: number; // Số thứ tự trong playlist
  listens: number; // Lượt nghe
  likes: number; // Lượt thích
  moods?: IMood[]; // Tâm trạng
}

export interface SongRequestDto {
  title: string;
  description: string;
  genreId: string;
  moodIds: string[];
  public: boolean;
  songPath: string;
  duration?: number;
  imagePath?: string;
  lyricPath?: string;
}

export interface ILyric {
  time: number;
  text: string;
}
