"use client";

import { paths } from "@/lib/constants";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import FormItem from "./FormItem";
import styles from "./style.module.scss";
import * as Yup from "yup";
import { Formik } from "formik";

interface formModel {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register = () => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    name: Yup.string().required("Tên không được để trống"),
    password: Yup.string().required("Mật khẩu không được để trống"),
    password_confirmation: Yup.string()
      .required("Không được trống")
      .equals([Yup.ref("password"), null], "Mật khẩu không khớp"),
  });

  const handleSuccessLoginGoogle = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
  };
  const submit = async (values: formModel) => {
    console.log(values);
  }

  return (
    <div className={`${styles.Auth}`}>
      <div className={`${styles.Auth_logo}`}>
        <h2>Create an account</h2>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
          inventore ut qui
        </span>
      </div>
      <div className={`${styles.Auth_form}`}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            password_confirmation: "",
            name: "",
          }}
          validationSchema={validationSchema}
          onSubmit={submit}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
              <FormItem
                error={errors.name}
                name="name"
                placeholder="Name"
                type="text"
                value={values.name}
                onChangeValue={handleChange}
              />

              <FormItem
                error={errors.email}
                name="email"
                placeholder="Email"
                type="text"
                value={values.email}
                onChangeValue={handleChange}
              />

              <FormItem
                error={errors.password}
                name="password"
                placeholder="Password"
                type="password"
                value={values.password}
                onChangeValue={handleChange}
              />

              <FormItem
                error={errors.password_confirmation}
                name="password_confirmation"
                placeholder="Re-Password"
                type="password"
                value={values.password_confirmation}
                onChangeValue={handleChange}
              />

              <button type="submit" className={`${styles.Auth_form_button}`}>
                Register
              </button>
            </form>
          )}
        </Formik>

        <div className={`${styles.Auth_form_forgot}`}>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        {/* <button onClick={handleSubmit} className={`${styles.Auth_form_button}`}>
          Register
        </button> */}

        <hr />

        <GoogleLogin
          onSuccess={(res) => handleSuccessLoginGoogle(res)}
          onError={() => {
            toast.error("Login with google failed");
          }}
        />

        <div className={`${styles.Auth_form_redirect}`}>
          <span>You already have an account?</span>
          <Link href={paths.LOGIN}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
