import Account from "../models/Accounts";
import RefreshToken from "../models/RefreshToken";

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

  static async create(payload: Partial<Account>) {
    return Account.create(payload);
  }

  static async update(id: string, payload: Partial<Account>) {
    return Account.update(payload, { where: { id } });
  }

  static getRefeshTokenById = (id: string) => RefreshToken.findByPk(id);
  static getRefeshTokenByToken = (token: string) =>
    RefreshToken.findOne({ where: { token } });
  static createRefreshToken = (id: string, token: string) =>
    RefreshToken.create({ id, token });
  static updateRefreshToken = (id: string, token: string) =>
    RefreshToken.update({ token }, { where: { id } });
  static deleteRefreshToken = (id: string) =>
    RefreshToken.destroy({ where: { id } });
}
