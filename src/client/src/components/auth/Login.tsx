"use client";

import { setUser } from "@/features/userSlice";
import { paths } from "@/lib/constants";
import tokenService from "@/lib/tokenService";
import authService, { LoginRequestDto } from "@/services/auth.service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { LoginGoogleRequestDto } from "../../services/auth.service";
import FormItem from "./FormItem";
import styles from "./style.module.scss";
import * as Yup from "yup";
import { Formik } from "formik";

const Login = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const validationSchema = Yup.object({
    email: Yup.string().email("Email not valid").required("Email not empty"),
    password: Yup.string()
      .required("Password not empty")
      .min(6, "Password must be at least 6 characters"),
  });

  const submit = async (values: LoginRequestDto) => {
    if(loading) return;
    setLoading(true);
    try {
      const { data } = await authService.login(values);
      tokenService.accessToken = data.accessToken;
      tokenService.refreshToken = data.refreshToken;
      dispatch(setUser(data));
      router.push("/");
      toast.success("Login successfully");
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || "Login failed");
    } finally{
      setLoading(false);
    }
  };

  const handleSuccessLoginGoogle = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const res: LoginGoogleRequestDto = {
        credential: credentialResponse?.credential || "",
        clientId: credentialResponse?.clientId || "",
      };
      const { data } = await authService.loginGoogle(res);
      tokenService.accessToken = data.accessToken;
      tokenService.refreshToken = data.refreshToken;
      dispatch(setUser(data));
      router.push("/");
      toast.success("Login successfully");
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || "Login failed");
    }
  };

  return (
    <div className={`${styles.Auth}`}>
      <div className={`${styles.Auth_logo}`}>
        <h2>Login</h2>
        <span>
          Login with your email and password or login with your google account
        </span>
      </div>
      <div className={`${styles.Auth_form}`}>
        {error && <div className={`${styles.Auth_form_error}`}>{error}</div>}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          validateOnChange={false} // Chỉ thực hiện validation khi blur
          validateOnBlur={true} // Bật validation khi rời khỏi ô input
          onSubmit={submit}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
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
              <div className={`${styles.Auth_form_forgot}`}>
                <a href="/forgot-password">Forgot password ?</a>
              </div>

              <button type="submit" className={`${styles.Auth_form_button}`}>
                Login
              </button>
            </form>
          )}
        </Formik>
 
        <hr />

        <GoogleLogin
          onSuccess={(res) => handleSuccessLoginGoogle(res)}
          onError={() => {
            toast.error("Login with google failed");
          }}
        />
        <div className={`${styles.Auth_form_redirect}`}>
          <span>Don&apos;t have an account ?</span>
          <Link href={paths.REGISTER}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
