import Login from "@/components/auth/Login";
import React from "react";
import styles from "./style.module.scss";

const LoginPage = () => {
  return (
    <div className={styles.Login}>
      <Login />
    </div>
  );
};

export default LoginPage;
