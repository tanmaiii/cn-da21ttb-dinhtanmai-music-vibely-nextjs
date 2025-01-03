
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


export interface UserRequestDto{
  name: string,
  email: string,
  password: string,
  role?: string,
  imagePath?: string,
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
  data: IUser & {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface ValidationeResponseDto {
  data: IUser;
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
  data: IUser & {
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
  data: IUser;
}
