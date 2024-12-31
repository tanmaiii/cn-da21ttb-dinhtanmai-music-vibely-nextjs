import createHttpClient from "@/lib/createHttpClient";
import tokenService from "@/lib/tokenService";
import { ResponseAPI } from "@/types";
import {
  CheckUserRequestDto,
  LoginGoogleRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ValidationeResponseDto,
} from "@/types/auth.type";
import { AxiosInstance } from "axios";

class AuthServices {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient("api/auth");
  }

  async test(stringId: string) {
    return await (await this.client).get("/song/" + stringId);
  }

  async login(body: LoginRequestDto): Promise<LoginResponseDto> {
    const res = await (
      await this.client
    ).post<LoginResponseDto>("/login", body);
    return res.data;
  }

  async register(body: RegisterRequestDto): Promise<RegisterResponseDto> {
    const response = await (
      await this.client
    ).post<RegisterResponseDto>("/register", body);
    return response.data;
  }

  // Kiểm tra token
  async identify(): Promise<CheckUserRequestDto> {
    const response = await (
      await this.client
    ).get<ValidationeResponseDto>("/validate");
    return response.data;
  }

  async refreshToken(body: RefreshTokenRequestDto) {
    const response = await (
      await this.client
    ).post<ResponseAPI<RefreshTokenResponseDto>>("/refresh-token", body);
    return response.data;
  }

  async logout(body: RefreshTokenRequestDto) {
    const res = await (await this.client).post("/logout", body);
    window.location.href = "/";
    tokenService.clear();
    return res;
  }

  async loginGoogle(body: LoginGoogleRequestDto) {
    const response = await (
      await this.client
    ).post<LoginResponseDto>("/login-google", body);
    return response.data;
  }
}

export default new AuthServices() as AuthServices;
