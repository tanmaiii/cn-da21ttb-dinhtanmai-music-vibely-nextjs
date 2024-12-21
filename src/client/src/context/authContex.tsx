"use client";

import { setUser } from "@/features/userSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import authService from "@/services/auth.service";
import React, { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const { data } = await authService.identify();
      if (data) {
        dispatch(setUser(data));
      }
    })();
  });

  return <>{children}</>;
}
