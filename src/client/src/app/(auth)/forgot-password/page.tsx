import React from "react";
import styles from "./style.module.scss";
import ForgotPassword from "@/components/auth/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <div className={styles.ForgotPassword}>
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;
