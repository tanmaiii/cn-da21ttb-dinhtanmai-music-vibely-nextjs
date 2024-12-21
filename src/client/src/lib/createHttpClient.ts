import axios from "axios";
import queryString from "query-string";
import tokenService from "./tokenService";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const createHttpClient = (baseurl: string) => {
  const httpClient = axios.create({
    baseURL: `${API}/${baseurl}`,
    timeout: 10000,
    paramsSerializer: (params) => queryString.stringify(params),
  });

  httpClient.interceptors.request.use((config) => {
    // const now = new Date().getTime() / 1000; // lấy thời gian hiện tại

    // const tokenExpiratedAt = tokenService.expiratedAt; // lấy thời gian hết hạn của token
    // const isRefreshToken = config.url?.endsWith("refresh-token"); // kiểm tra có phải là request refresh token không

    // if (
    //   tokenService.accessToken !== "" &&
    //   (jwtDecode<{ exp: number }>(tokenService.accessToken).exp || 0) < now &&
    //   tokenService.refreshToken &&
    //   !isRefreshToken
    // ) {
    //   return refreshToken().then((data) => {
    //     if (data) {
    //       const { accessToken, expirationTime } = data;
    //       tokenService.accessToken = accessToken;
    //       tokenService.expiratedAt = expirationTime;
    //     }
    //     if (config.headers) {
    //       config.headers = {
    //         Authorization: `Bearer ${tokenService.accessToken}`,
    //         Accept: "application/json",
    //         ...config.headers,
    //       };
    //     }
    //     return config;
    //   });
    // }

    // Trường hợp không cần refresh token
    if (tokenService.accessToken && config.headers) {
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
