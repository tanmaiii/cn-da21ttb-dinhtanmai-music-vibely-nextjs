// middleware.ts (hoặc middleware.js)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { IUser } from "./types/user.type";
import { ROLES } from "./lib/constants";

const authPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]; // Các trang auth cần bảo vệ

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken"); // Lấy token từ cookies
  let user: IUser | null = null;
  const { pathname } = req.nextUrl;
  if (token) {
    try {
      user = jwtDecode<IUser>(token.value); // Sử dụng generic để nhận đúng loại IUser
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  if (!token && !authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", req.url)); // Chuyển đến login
  }

  if (token && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.url)); // Chuyển hướng về trang chủ
  }

  // Ngăn chặn truy cập vào /admin nếu người dùng không phải admin
  if (pathname.startsWith("/admin") && (!user || user.role.name !== ROLES.ADMIN)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Cấu hình để áp dụng middleware cho các đường dẫn nhất định
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Bảo vệ tất cả các trang ngoại trừ tệp tĩnh và API
};
