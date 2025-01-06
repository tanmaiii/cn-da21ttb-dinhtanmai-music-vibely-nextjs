// src/routes/user.ts
import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  login,
  loginGoogle,
  logout,
  refreshToken,
  register,
  validate,
} from "../controllers/auth.controller";
import { authorize, validateData } from "../middleware";
import {
  changePasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
} from "../schema/auth.schema";
import { forgotPasswordSchema } from "../schema/user.schema";
const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Các chức năng liên quan đến xác thực người dùng
 */

/**
 * @swagger
 * /validate:
 *   get:
 *     summary: Xác thực thông tin người dùng
 *     description: Kiểm tra tính hợp lệ của thông tin người dùng hiện tại
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Thông tin hợp lệ
 *       401:
 *         description: Người dùng chưa được xác thực
 */
router.get("/validate", authorize(), validate);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     description: Tạo tài khoản người dùng mới với thông tin được cung cấp
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 */
router.post("/register", validateData(registerSchema), register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     description: Đăng nhập và nhận token xác thực cho người dùng
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Thông tin đăng nhập không chính xác
 */
router.post("/login", validateData(loginSchema), login);

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Lấy token mới
 *     description: Làm mới token xác thực để tiếp tục sử dụng dịch vụ
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *       400:
 *         description: Refresh token không hợp lệ
 */
router.post("/refresh-token", validateData(refreshTokenSchema), refreshToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     description: Đăng xuất người dùng và hủy token xác thực
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Người dùng chưa được xác thực
 */
router.post("/logout", authorize(), validateData(logoutSchema), logout);

/**
 * @swagger
 * /login-google:
 *   post:
 *     summary: Đăng nhập với Google
 *     description: Đăng nhập người dùng qua tài khoản Google
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Lỗi trong quá trình đăng nhập
 */
router.post("/login-google", loginGoogle);

/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Thay đổi mật khẩu
 *     description: Cập nhật mật khẩu mới cho người dùng đã xác thực
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thay đổi mật khẩu thành công
 *       400:
 *         description: Mật khẩu cũ không chính xác hoặc dữ liệu không hợp lệ
 *       401:
 *         description: Người dùng chưa được xác thực
 */
router.post(
  "/change-password",
  authorize(),
  validateData(changePasswordSchema),
  changePassword
);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     description: Cung cấp hướng dẫn để khôi phục mật khẩu cho người dùng
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã gửi hướng dẫn khôi phục mật khẩu
 *       400:
 *         description: Email không hợp lệ hoặc không tìm thấy tài khoản
 */
router.post(
  "/forgot-password",
  validateData(forgotPasswordSchema),
  forgotPassword
);

export default router;
