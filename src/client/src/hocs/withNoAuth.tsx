
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { paths } from "@/lib/constants";

const withNoAuth = (Component: React.ComponentType) => {
  return () => {
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();

    useEffect(() => {
      if (user) {
        router.push(paths.HOME);
      } 
    }, [user, router]);

    if (user) return null;

    return <Component />;
  };
};

export default withNoAuth;
