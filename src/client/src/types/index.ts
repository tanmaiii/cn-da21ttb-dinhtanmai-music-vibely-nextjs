export interface IMood {
  id: string;
  title: string;
  description: string;
}

export interface IPrivacy {
  value: string;
  label: string;
  description: string;
}

export interface ISong {
  id: string;
  title: string;
  slug?: string; // URL
  description: string;
  imagePath?: string;
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

export interface IRoom {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  public: boolean;
  max_user: number;
  creator: IArtist;
}

export interface IPlaylist {
  id: string;
  title: string;
  slug?: string; // URL
  description: string;
  imagePath: string;
  genre?: IGenre;
  creator: IArtist;
  createdAt: string;
  public: boolean;
  total: number;
  likes: number;
  moods?: IMood[];
}

export interface IArtist {
  id: string;
  name: string;
  slug?: string;
  imagePath?: string;
  followers: number;
}

export interface IArtistOverview extends IArtist {
  totalSong: number;
  songs: ISong[];
  discography: IDiscography;
}

export interface IDiscography {
  playlist: IPlaylist[];
  latest: ISong[];
  topSong: ISong[];
}

export interface Ilyric {
  timeStart: string;
  words: string;
}

export interface IGenre {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  color: string;
}
