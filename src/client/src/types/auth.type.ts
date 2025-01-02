import IArtist from "./artist.type";

export interface IUser {
  id: string;
  name: string;
  email: string;
  slug: string;
  role: IRole;
  imagePath: string;
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

// Đăng nhập
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginGoogleRequestDto {
  clientId: string;
  credential: string;
}

export interface LoginResponseDto {
  data: IArtist & {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface ValidationeResponseDto {
  data: IArtist;
  message: string;
}

// Đăng ký
export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponseDto {
  data: IArtist & {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

// Token
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface CheckUserRequestDto {
  data: IArtist;
}
