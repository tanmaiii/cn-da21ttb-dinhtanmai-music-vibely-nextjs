import { ResponseAPI } from "@/types";
import { RefreshTokenResponseDto } from "@/types/auth.type";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import queryString from "query-string";
import apiConfig from "./api";
import tokenService from "./tokenService";
import { paths } from "./constants";

const API = apiConfig.baseUrl;

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
        const res = await axios.post<ResponseAPI<RefreshTokenResponseDto>>(
          `${API}/api/auth/refresh-token`,
          {
            refreshToken: tokenService.refreshToken,
          }
        );
        tokenService.accessToken = res.data.data.accessToken;
        tokenService.refreshToken = res.data.data.refreshToken;
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
