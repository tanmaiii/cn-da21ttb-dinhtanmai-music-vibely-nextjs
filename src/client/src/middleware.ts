// middleware.ts (hoặc middleware.js)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]; // Các trang auth cần bảo vệ

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken"); // Lấy token từ cookies
  const { pathname } = req.nextUrl;

  if (!token && !authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", req.url)); // Chuyển đến login
  }

  if (token && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.url)); // Chuyển hướng về trang chủ
  }

  return NextResponse.next();
}

// Cấu hình để áp dụng middleware cho các đường dẫn nhất định
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Bảo vệ tất cả các trang ngoại trừ tệp tĩnh và API
};
