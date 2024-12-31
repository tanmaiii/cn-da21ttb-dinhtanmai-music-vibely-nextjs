import { ResponseAPI } from "@/types";
import {
  RefreshTokenResponseDto
} from "@/types/auth.type";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import queryString from "query-string";
import { paths } from "./constants";
import tokenService from "./tokenService";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const createHttpClient = (baseurl: string = "") => {
  const httpClient = axios.create({
    baseURL: `${API}/${baseurl}`,
    timeout: 10000,
    paramsSerializer: (params) => queryString.stringify(params),
  });

  httpClient.interceptors.request.use(async (config) => {
    const now = new Date().getTime() / 1000; // lấy thời gian hiện tại

    const isRefreshToken = config.url?.endsWith("refresh-token"); // kiểm tra có phải là request refresh token không

    if (
      tokenService.accessToken !== "" &&
      (jwtDecode<{ exp: number }>(tokenService.accessToken).exp || 0) < now &&
      tokenService.refreshToken &&
      !isRefreshToken
    ) {
      try {
        const res = (await axios.post(`${API}/auth/refresh-token`, {
          refreshToken: tokenService.refreshToken,
        })) as ResponseAPI<RefreshTokenResponseDto>;

        tokenService.accessToken = res.data.accessToken;
        tokenService.refreshToken = res.data.refreshToken;
      } catch (error) {
        console.error("Refresh token failed", error);
        window.location.href = paths.LOGOUT;
        throw error;
      }
    }

    // Trường hợp không cần refresh token
    if (tokenService.accessToken && !isRefreshToken) {
      config.headers.Authorization = `Bearer ${tokenService.accessToken}`;
    }

    return config;
  });

  httpClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      throw error.response?.data || error;
    }
  );

  return httpClient;
};

export default createHttpClient;
