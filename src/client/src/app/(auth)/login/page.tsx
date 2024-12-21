"use client";

import Login from "@/components/auth/Login";
import withNoAuth from "@/hocs/withNoAuth";
import styles from "./style.module.scss";

const LoginPage = () => {
  return (
    <div className={styles.Login}>
      <Login />
    </div>
  );
};

export default withNoAuth(LoginPage);
