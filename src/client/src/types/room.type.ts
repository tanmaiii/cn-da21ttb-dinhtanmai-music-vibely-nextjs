import IArtist from "./artist.type";

export interface IRoom {
  id: string;
  title: string;
  description: string;
  imagePath?: string;
  creator: IArtist;
  membersCount: number;
  songCount: number;
  createAt: string;
}

export interface RoomRequestDto {}