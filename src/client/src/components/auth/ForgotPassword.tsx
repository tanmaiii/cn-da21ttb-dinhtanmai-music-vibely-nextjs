"use client";

import React, { useState } from "react";
import FormItem from "./FormItem";
import styles from "./style.module.scss";
import Link from "next/link";
import { paths } from "@/lib/constants";

interface ILoginProps {
  email: string;
}

const ForgotPassword = () => {
  const [formData, setFormData] = useState<ILoginProps>({
    email: "",
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
    const newErrors: ILoginProps = { email: "" };
    let isValid = true;

    // Kiểm tra email
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email not valid";
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
        <h2>Forgot password</h2>
        <span>
          Enter your email address and we will send you a link to reset your
          password
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

        <button onClick={handleSubmit} className={`${styles.Auth_form_button}`}>
          Send email
        </button>

        <div className={`${styles.Auth_form_redirect}`}>
          <span>Don t have an account?</span>
          <Link href={paths.REGISTER}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
