"use client";

import React, { useState } from "react";
import styles from "./style.module.scss";
import FormItem from "./FormItem";
import Link from "next/link";
import { paths } from "@/lib/constants";
import { IMAGES } from "@/lib/constants";
import Image from "next/image";

interface ILoginProps {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<ILoginProps>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<ILoginProps>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors: ILoginProps = { email: "", password: "" };
    let isValid = true;

    // Kiểm tra email
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email not valid";
      isValid = false;
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log(formData);
    }
  };

  return (
    <div className={`${styles.Auth}`}>
      <div className={`${styles.Auth_logo}`}>
        <h2>Login</h2>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
          inventore ut qui
        </span>
      </div>
      <div className={`${styles.Auth_form}`}>
        <FormItem
          name={"email"}
          onChangeValue={handleChange}
          placeholder="Email"
          type="text"
          error={errors.email}
        />
        <FormItem
          name={"password"}
          onChangeValue={handleChange}
          placeholder="Password"
          type="password"
          error={errors.password}
        />

        <div className={`${styles.Auth_form_forgot}`}>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button
          onClick={handleSubmit}
          className={`${styles.Auth_form_button}`}
        >
          Login
        </button>

        <hr />

        <button className={`${styles.Auth_form_button_gg}`}>
          <Image src={IMAGES.GOOGLE} alt="google" />
          <span>Login with Google</span>
        </button>

        <div className={`${styles.Auth_form_redirect}`}>
          <span>Don t have an account?</span>
          <Link href={paths.REGISTER}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
