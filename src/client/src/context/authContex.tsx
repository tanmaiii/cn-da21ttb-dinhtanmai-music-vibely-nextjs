"use client";

import { setUser } from "@/features/userSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import tokenService from "@/lib/tokenService";
import authService from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
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
        }
      })();
    }
  });

  const {} = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await authService.identify();
      if (data) {
        dispatch(setUser(data));
      }
      return data;
    },
  });

  return <>{children}</>;
}
