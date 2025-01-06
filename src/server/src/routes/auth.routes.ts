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

router.get("/validate", authorize(), validate);

router.post("/register", validateData(registerSchema), register);

router.post("/login", validateData(loginSchema), login);

router.post("/refresh-token", validateData(refreshTokenSchema), refreshToken);

router.post("/logout", authorize(), validateData(logoutSchema), logout);

router.post("/login-google", loginGoogle);

router.post(
  "/change-password",
  authorize(),
  validateData(changePasswordSchema),
  changePassword
);

router.post(
  "/forgot-password",
  validateData(forgotPasswordSchema),
  forgotPassword
);

export default router;
