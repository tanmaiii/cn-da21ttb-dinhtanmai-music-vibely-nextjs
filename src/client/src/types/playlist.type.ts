import { IArtist, IGenre, IMood, ISong } from ".";

export interface IPlaylist {
  id: string;
  title: string;
  slug?: string; // URL
  description: string;
  imagePath?: string;
  genre?: IGenre;
  creator: IArtist;
  createdAt: string;
  public: boolean;
  total: number;
  likes: number;
  moods?: IMood[];
}

export interface IResSongInPlaylist {
  songId: string;
  playlistId: string;
  song: ISong;
}
