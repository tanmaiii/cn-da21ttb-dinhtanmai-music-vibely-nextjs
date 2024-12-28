import authService from "@/services/auth.service";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 
import queryString from "query-string";
import { paths } from "./constants";
import tokenService from "./tokenService";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const createHttpClient = (baseurl: string) => {
  const httpClient = axios.create({
    baseURL: `${API}/${baseurl}`,
    timeout: 15000, // Tăng timeout nếu cần
    paramsSerializer: (params) => queryString.stringify(params),
  });

  // Interceptor request
  httpClient.interceptors.request.use(async (config) => {
    const now = new Date().getTime() / 1000; // thời gian hiện tại
    const isRefreshToken = config.url?.endsWith("refresh-token");

    if (
      tokenService.accessToken &&
      (jwtDecode<{ exp: number }>(tokenService.accessToken).exp || 0) < now &&
      tokenService.refreshToken &&
      !isRefreshToken
    ) {
      try {
        const res = await authService.refreshToken({ refreshToken: tokenService.refreshToken });
        tokenService.accessToken = res.data.accessToken;
        tokenService.refreshToken = res.data.refreshToken;
      } catch (error) {
        console.error("Refresh token failed", error);
        window.location.href = paths.LOGOUT;
        throw error;
      }
    }

    if (tokenService.accessToken && !isRefreshToken) {
      config.headers.Authorization = `Bearer ${tokenService.accessToken}`;
    }

    return config;
  });

  // Interceptor response
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      if (status === 401) {
        console.warn("Unauthorized! Redirecting to login.");
        window.location.href = paths.LOGOUT;
      } else if (status === 403) {
        console.warn("Forbidden! Access denied.");
      } else {
        console.error("API Error:", error.response?.data || error);
      }

      throw error.response?.data || error;
    }
  );

  return httpClient;
};

export default createHttpClient;
