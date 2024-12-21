import Cookies from "js-cookie";

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
    // localStorage.setItem(this._accessTokenKey, value);
    Cookies.set(this._accessTokenKey, value, { expires: 1 / 24 });
  }

  get refreshToken() {
    return this._refreshToken;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
    // localStorage.setItem(this._refreshTokenKey, value);
    Cookies.set(this._refreshTokenKey, value, { expires: 1 / 24 });
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
