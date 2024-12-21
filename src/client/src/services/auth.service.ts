import { userState } from "@/features/userSlice";
import createHttpClient from "@/lib/createHttpClient";

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
  data: userState & {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface ValidationeResponseDto {
  data: userState;
  message: string;
}

// Đăng ký
export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponseDto {
  data: userState & {
    accescToken: string;
  };
  message: string;
}

// Token
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
}

export interface CheckUserRequestDto {
  data: userState;
}

class AuthSevices {
  private client;

  constructor() {
    this.client = createHttpClient("api/auth");
  }

  async test(stringId: string) {
    return await this.client.get("/song/" + stringId);
  }

  async login(body: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.client.post<LoginResponseDto>("/login", body);
    return response.data;
  }

  async register(body: RegisterRequestDto): Promise<RegisterResponseDto> {
    const response = await this.client.post<RegisterResponseDto>(
      "/register",
      body
    );
    return response.data;
  }

  // Kiểm tra token
  async identify(): Promise<CheckUserRequestDto> {
    const response = await this.client.get<ValidationeResponseDto>("/validate");
    return response.data;
  }

  async refreshToken(body: RefreshTokenRequestDto) {
    const response = await this.client.post<RefreshTokenResponseDto>(
      "/refresh-token",
      body
    );
    return response.data;
  }

  async logout(body: RefreshTokenResponseDto) {
    return await this.client.post("/logout", body);
  }

  async loginGoogle(body: LoginGoogleRequestDto) {
    const response = await this.client.post<LoginResponseDto>(
      "/login-google",
      body
    );
    return response.data;
  }
}

const authService = new AuthSevices();
export default authService;
