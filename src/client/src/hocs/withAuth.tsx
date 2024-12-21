
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

const withAuth = (Component: React.ComponentType, role?: string) => {
  return () => {
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/login");
      } else if (role && user.role?.name !== role) {
        router.push("/admin");
      }
    }, [user, router]);

    if (!user) return null;

    return <Component />;
  };
};

export default withAuth;
