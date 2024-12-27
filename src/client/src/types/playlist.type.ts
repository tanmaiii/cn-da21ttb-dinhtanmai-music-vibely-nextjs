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

export interface PlaylistRequestDto {
  title: string;
  description: string;
  public: boolean;
  genreId: string;
  moodIds?: string[];
  songIds?: string[];
  imagePath?: string;
}

export interface PlaylistLikeQueryParamsDto {
  page?: number;
  limit?: number;
  keyword?: string;
  my: string,
}
