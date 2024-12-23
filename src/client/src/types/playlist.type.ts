import { IArtist, IGenre, IMood } from ".";

export default interface IPlaylist {
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