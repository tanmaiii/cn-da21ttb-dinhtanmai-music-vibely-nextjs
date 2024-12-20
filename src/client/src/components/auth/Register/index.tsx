"use client";

import React, { useState } from "react";
import styles from "./style.module.scss";
import FormItem from "../FormItem";
import Link from "next/link";
import { IMAGES, paths } from "@/lib/constants";
import Image from "next/image";

interface IRegisterProps {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register = () => {
  const [formData, setFormData] = useState<IRegisterProps>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Partial<IRegisterProps>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors: IRegisterProps = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length < 6) {
      newErrors.name = "Name must be at least 6 characters";
      isValid = false;
    }

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

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Re-Password is required";
      isValid = false;
    } else if (formData.password_confirmation !== formData.password) {
      newErrors.password_confirmation = "Re-Password not match";
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
    <div className={`${styles.Register}`}>
      <div className={`${styles.Register_logo}`}>
        <h2>Create an account</h2>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
          inventore ut qui
        </span>
      </div>
      <div className={`${styles.Register_form}`}>
        <FormItem
          error={errors.name}
          name="name"
          placeholder="Name"
          type="text"
          value={formData.name}
          onChangeValue={handleChange}
        />

        <FormItem
          error={errors.email}
          name="email"
          placeholder="Email"
          type="text"
          value={formData.email}
          onChangeValue={handleChange}
        />

        <FormItem
          error={errors.password}
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChangeValue={handleChange}
        />

        <FormItem
          error={errors.password_confirmation}
          name="password_confirmation"
          placeholder="Re-Password"
          type="password"
          value={formData.password_confirmation}
          onChangeValue={handleChange}
        />

        <div className={`${styles.Register_form_forgot}`}>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button
          onClick={handleSubmit}
          className={`${styles.Register_form_button}`}
        >
          Register
        </button>

        <hr />

        <button className={`${styles.Register_form_button_gg}`}>
          <Image src={IMAGES.GOOGLE} alt="google" />
          <span>Register with Google</span>
        </button>

        <div className={`${styles.Register_form_redirect}`}>
          <span>You already have an account?</span>
          <Link href={paths.LOGIN}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
