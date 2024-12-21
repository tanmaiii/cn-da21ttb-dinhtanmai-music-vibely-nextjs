'use client';

import React from "react";
import styles from "./style.module.scss";
import ForgotPassword from "@/components/auth/ForgotPassword";
import withNoAuth from "@/hocs/withNoAuth";

const ForgotPasswordPage = () => {
  return (
    <div className={styles.ForgotPassword}>
      <ForgotPassword />
    </div>
  );
};

export default withNoAuth(ForgotPasswordPage);
