"use client";

import { setUser } from "@/features/userSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import tokenService from "@/lib/tokenService";
import authService from "@/services/auth.service";
import React, { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tokenService.accessToken) {
      (async () => {
        const { data } = await authService.identify();
        if (data) {
          dispatch(setUser(data));
        } else {
          tokenService.clear();
        }
      })();
    }
  });

  return <>{children}</>;
}
