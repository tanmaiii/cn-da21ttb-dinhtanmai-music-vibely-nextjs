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

export interface RoomRequestDto {
  title: string;
  description: string;
  imagePath?: string;
  songIds?: string[];
}

export interface IMessageChat {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  room: IRoom;
  user: IArtist;
  createAt: Date;
}

export interface ChatRequestDto {
  roomId: string;
  content: string;
  userId: string;
}
