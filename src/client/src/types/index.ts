import IArtist from './artist.type';
import IPlaylist from "./playlist.type";
import ISong from "./song.type";

export type { default as ISong } from "./song.type";
export type { default as IPlaylist } from "./playlist.type";
export type { default as IArtist } from "./artist.type";
export type { ListResponse, ResponseAPI, QueryParams, ISort } from "./common.type";

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


export interface IRoom {
  id: string;
  title: string;
  description: string;
  imagePath?: string;
  public: boolean;
  max_user: number;
  creator: IArtist;
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
  imagePath?: string;
  color: string;
}
