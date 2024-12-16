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
      const result = await authService.identify();
      if (result.data) {
        dispatch(setUser(result.data));
      }
    })();
  });

  return <>{children}</>;
}
