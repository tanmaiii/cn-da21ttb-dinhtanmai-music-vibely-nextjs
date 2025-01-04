import { ISort } from "./common.type";

export interface IUser {
  id: string;
  name: string;
  email: string;
  slug: string;
  imagePath: string;
  followers: number;
  songs: number;
  playlists: number;
  role: IRole;
}

export interface IRole {
  id: string;
  name: string;
  permissions: IPermission[];
}

export interface IPermission {
  id: string;
  name: string;
}

export interface QueryParamsUser {
  page?: number;
  limit?: number;
  sort?: ISort;
  keyword?: string;
  role?: string;
}

export interface UserRequestDto{
    name: string,
    email: string,
    password: string,
    role?: string,
    imagePath?: string,
  }
  