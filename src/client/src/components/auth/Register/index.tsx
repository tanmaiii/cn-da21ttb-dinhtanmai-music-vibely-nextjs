import React from "react";
import styles from "./style.module.scss";
import FormItem from "../FormItem";
import Link from "next/link";
import { paths } from "@/lib/constants";

const Register = () => {
  return (
    <div className={`${styles.Register}`}>
      <div className={`${styles.Register_logo}`}>
        <h2>Create an account</h2>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
          inventore ut qui
        </span>
      </div>
      <div className={`${styles.Register_form}`}>
        <FormItem name="name" placeholder="Name" type="text" value="" />
        <FormItem name="email" placeholder="Email" type="text" value="" />
        <FormItem
          name="password"
          placeholder="Password"
          type="password"
          value=""
        />

        <FormItem
          name="re-password"
          placeholder="Re-Password"
          type="password"
          value=""
        />

        <div className={`${styles.Register_form_forgot}`}>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button className={`${styles.Register_form_button}`}>Register</button>

        <div className={`${styles.Register_form_redirect}`}>
          <span>You already have an account?</span>
          <Link href={paths.LOGIN}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
