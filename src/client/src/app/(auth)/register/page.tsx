"use client";

import Register from "@/components/auth/Register";
import withNoAuth from "@/hocs/withNoAuth";
import style from "./style.module.scss";

const RegisterPage = () => {
  return (
    <div className={style.Register}>
      <Register />
    </div>
  );
};

export default withNoAuth(RegisterPage);
