import { IArtist, IGenre, IMood } from ".";

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
  songsCount: number;
  moods?: IMood[];
}

export interface IBodyCreatePlaylist {
  title: string;
  description: string;
  public: boolean;
  genreId: string;
  moodIds?: string[];
  songIds?: string[];
  image?: File;
}
