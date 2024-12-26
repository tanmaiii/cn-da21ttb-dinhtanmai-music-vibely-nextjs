import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

class TokenService {
  private _accessTokenKey = "accessToken";
  private _refreshTokenKey = "refreshToken";

  private _accessToken = "";
  private _refreshToken = "";

  constructor() {
    if (typeof window === "undefined") return;

    // this._accessToken = localStorage.getItem(this._accessTokenKey) || "";
    // this._refreshToken = localStorage.getItem(this._refreshTokenKey) || "";

    this._accessToken = Cookies.get(this._accessTokenKey) || "";
    this._refreshToken = Cookies.get(this._refreshTokenKey) || "";
  }

  get accessToken() {
    return this._accessToken;
  }

  set accessToken(value: string) {
    this._accessToken = value;
    const decodedToken = jwtDecode<{ exp: number }>(value); // decode token
    const expirationTimeInSeconds =
      decodedToken.exp - Math.floor(Date.now() / 1000); // tính thời gian hết hạn của token
    const expirationInDays = expirationTimeInSeconds / (60 * 60 * 24); // tính thời gian hết hạn của token theo ngày
    Cookies.set(this._accessTokenKey, value, { expires: expirationInDays });
  }

  get refreshToken() {
    return this._refreshToken;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
    const decodedToken = jwtDecode<{ exp: number }>(value); // decode token
    const expirationTimeInSeconds =
      decodedToken.exp - Math.floor(Date.now() / 1000); // tính thời gian hết hạn của token
    const expirationInDays = expirationTimeInSeconds / (60 * 60 * 24); // tính thời gian hết hạn của token theo ngày
    Cookies.set(this._refreshTokenKey, value, { expires: expirationInDays });
  }

  clear() {
    this._accessToken = "";
    this._refreshToken = "";

    // localStorage.removeItem(this._accessTokenKey);
    // localStorage.removeItem(this._refreshTokenKey);
    Cookies.remove(this._accessTokenKey);
    Cookies.remove(this._refreshTokenKey);
  }
}

export default new TokenService() as TokenService;
