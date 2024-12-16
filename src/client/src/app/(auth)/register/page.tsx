import Register from "@/components/auth/Register";
import React from "react";
import style from "./style.module.scss";

const RegisterPage = () => {
  return (
    <div className={style.Register}>
      <Register />
    </div>
  );
};

export default RegisterPage;
