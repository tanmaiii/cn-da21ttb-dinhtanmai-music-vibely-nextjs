import React from "react";
import styles from "./style.module.scss";
import FormItem from "../FormItem";
import Link from "next/link";
import { paths } from "@/lib/constants";

const Login = () => {
  return (
    <div className={`${styles.Login}`}>
      <div className={`${styles.Login_logo}`}>
        <h2>Login</h2>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
          inventore ut qui
        </span>
      </div>
      <div className={`${styles.Login_form}`}>
        <FormItem name="email" placeholder="Email" type="text" value="" />
        <FormItem name="password" placeholder="Password" type="password" />

        <div className={`${styles.Login_form_forgot}`}>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button className={`${styles.Login_form_button}`}>Login</button>

        <div className={`${styles.Login_form_redirect}`}>
          <span>Don t have an account?</span>
          <Link href={paths.REGISTER}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
