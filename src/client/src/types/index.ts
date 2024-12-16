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
  description: string;
  image_path: string;
  genre?: IGenre;
  owner: IArtist[];
  createdAt: string;
  duration: string; // 00:00
  public: boolean;
  number: number;
  listen: number;
  followers_count: number;
  mood?: IMood[];
}

export interface IPlaylist {
  id: string;
  title: string;
  description: string;
  image_path: string;
  genre?: IGenre;
  owner: IArtist[];
  createdAt: string;
  public: boolean;
  total: number;
  followers_count: number;
  mood?: IMood[];
}

export interface IArtist {
  id: string;
  name: string;
  image_path: string;
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
  image_path: string;
  color: string;
}
