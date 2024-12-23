import Account from "../models/Accounts";
import RefreshToken from "../models/RefreshToken";
import TokenUtil from "../utils/jwt";

export const attributesAccount = [
  "id",
  "email",
  "userId",
  "username",
  "provider",
  "providerId",
];

export default class AccountsService {
  static async getById(id: string) {
    return Account.findByPk(id, {
      attributes: attributesAccount,
    });
  }

  static async getByEmail(email: string) {
    return Account.findOne({
      where: { email },
    });
  }

  static async getByUserId(userId: string) {
    return Account.findOne({
      where: { userId },
    });
  }

  static async create(payload: Partial<Account>) {
    return Account.create(payload);
  }

  static async update(id: string, payload: Partial<Account>) {
    return Account.update(payload, { where: { id } });
  }

  static createAccessToken = async (user: any) => {
    const accessToken = await TokenUtil.generateAccessToken(user);
    return accessToken;
  };

  static createRefreshToken = async (user: any) => {
    const refreshToken = TokenUtil.generateRefreshToken(user);

    const exitRefreshToken = await AccountsService.getRefeshTokenById(user.id);

    if (exitRefreshToken) {
      await RefreshToken.update(
        { token: refreshToken },
        { where: { id: user.id } }
      );
    } else {
      await RefreshToken.create({ id: user.id, token: refreshToken });
    }

    return refreshToken;
  };

  static getRefeshTokenById = (id: string) => RefreshToken.findByPk(id);
  static getRefeshTokenByToken = (token: string) =>
    RefreshToken.findOne({ where: { token } });
  static deleteRefreshToken = (id: string) =>
    RefreshToken.destroy({ where: { id } });
}
