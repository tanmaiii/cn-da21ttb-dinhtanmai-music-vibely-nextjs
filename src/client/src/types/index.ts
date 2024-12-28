import { IPlaylist } from "./playlist.type";
import ISong from "./song.type";

export type { default as IArtist } from "./artist.type";
export type {
  ISort,
  ListResponse,
  QueryParams,
  ResponseAPI,
} from "./common.type";
export type { IPlaylist, PlaylistRequestDto } from "./playlist.type";
export type { IRoom, RoomRequestDto } from "./room.type";
export type { default as ISong } from "./song.type";
export type { IGenre } from "./genre.type";
export type { IMood } from "./mood.type";

export interface IPrivacy {
  value: string;
  label: string;
  description: string;
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
