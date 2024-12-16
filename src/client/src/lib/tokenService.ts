class TokenService {
  private _accessTokenKey = "accessToken";
  private _refreshTokenKey = "refreshToken";

  private _accessToken = "";
  private _refreshToken = "";

  constructor() {
    if (typeof window === "undefined") return;

    this._accessToken = localStorage.getItem(this._accessTokenKey) || "";
    this._refreshToken = localStorage.getItem(this._refreshTokenKey) || "";
  }

  get accessToken() {
    return this._accessToken;
  }

  set accessToken(value: string) {
    this._accessToken = value;
    localStorage.setItem(this._accessTokenKey, value);
  }

  get refreshToken() {
    return this._refreshToken;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
    localStorage.setItem(this._refreshTokenKey, value);
  }

  clear() {
    this._accessToken = "";
    this._refreshToken = "";

    localStorage.removeItem(this._accessTokenKey);
    localStorage.removeItem(this._refreshTokenKey);
  }
}

export default new TokenService() as TokenService;
