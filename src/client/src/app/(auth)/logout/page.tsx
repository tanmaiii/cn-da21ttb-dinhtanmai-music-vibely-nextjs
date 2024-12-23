"use client";

import { clearUser } from "@/features/userSlice";
import { paths } from "@/lib/constants";
import tokenService from "@/lib/tokenService";
import authService from "@/services/auth.service";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = () => {
      authService.logout({ refreshToken: tokenService.refreshToken });
      tokenService.clear();
      dispatch(clearUser());
      router.push(paths.LOGIN);
    };
    handleLogout();
  }, [pathname]);

  return <div>Logout</div>;
};

export default Logout;
