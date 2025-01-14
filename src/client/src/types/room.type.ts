import IArtist from "./artist.type";

export interface IRoom {
  id: string;
  title: string;
  description: string;
  imagePath?: string;
  creator: IArtist;
  membersCount: number;
  songsCount: number;
  public: boolean;
  createdAt: string;
}

export interface RoomRequestDto {
  title: string;
  description: string;
  imagePath?: string;
  songIds?: string[];
  public?: boolean;
  password?: string;
}

export interface IMessageChat {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  room: IRoom;
  user: IArtist;
  createdAt: Date;
}

export interface ChatRequestDto {
  roomId: string;
  content: string;
  userId: string;
}

export interface AddMemberRequestDto {
  userId: string;
  password?: string;
}
