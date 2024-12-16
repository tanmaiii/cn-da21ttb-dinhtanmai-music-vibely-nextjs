import bcrypt from "bcrypt";

class PasswordUtil {
  // Mã hóa mật khẩu
  hash(password: string) {
    return bcrypt.hashSync(password, 12);
  }

  // So sánh mật khẩu
  compare(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}

export default new PasswordUtil();
