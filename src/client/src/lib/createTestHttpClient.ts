import axios from "axios";

const createHttpClient = (baseUrl: string = "") => {
  const client = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${baseUrl}`,
  });

  client.interceptors.request.use(async (config) => {
    // const now = new Date().getTime();
    // const tokenExpiratedAt = tokenService.expiratedAt;

    // const isRefreshToken = config.url?.endsWith('refresh-token');

    // if (tokenExpiratedAt < now && !isRefreshToken && tokenService.refreshToken) {
    //     const { accessToken, expirationTime } = (await axios.post(
    //         `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    //         {
    //             refreshToken: tokenService.refreshToken,
    //         },
    //     )) as RefreshTokenResponseDto;

    //     tokenService.accessToken = accessToken;
    //     tokenService.expiratedAt = expirationTime;
    // }

    // if (tokenService.accessToken && !isRefreshToken)
    //     config.headers.Authorization = `Bearer ${tokenService.accessToken}`;

    return config;
  });

  client.interceptors.response.use(
    (res) => res.data,
    async (error) => {
      throw error.response?.data || error;
    }
  );

  return client;
};

export default createHttpClient;
