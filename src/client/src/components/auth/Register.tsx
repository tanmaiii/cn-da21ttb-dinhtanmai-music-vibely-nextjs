"use client";

import { setUser } from "@/features/userSlice";
import { paths } from "@/lib/constants";
import tokenService from "@/lib/tokenService";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import FormItem from "./FormItem";
import styles from "./style.module.scss";
import { LoginGoogleRequestDto, RegisterRequestDto } from "@/types/auth.type";
import authService from "@/services/auth.service";

const Register = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name not empty")
      .min(6, "Name must be at least 6 characters"),
    email: Yup.string().email("Email not valid").required("Email not empty"),
    password: Yup.string()
      .required("Password not empty")
      .min(6, "Password must be at least 6 characters"),
    password_confirmation: Yup.string()
      .required("Password confirmation not empty")
      .equals([Yup.ref("password"), null], "Password confirmation not match"),
  });

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

  const submit = async (values: RegisterRequestDto) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await authService.register(values);
      tokenService.accessToken = data.accessToken;
      tokenService.refreshToken = data.refreshToken;
      toast.success("Register success");
      dispatch(setUser(data));
      router.push(paths.HOME);
    } catch (error: unknown) {
      console.error(error);
      setError((error as Error)?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.Auth}`}>
      <div className={`${styles.Auth_logo}`}>
        <h2>Create an account</h2>
        <span>Get started with your free account</span>
      </div>
      <div className={`${styles.Auth_form}`}>
        {error && <div className={`${styles.Auth_form_error}`}>{error}</div>}
        <Formik
          initialValues={{
            email: "",
            password: "",
            password_confirmation: "",
            name: "",
          }}
          validationSchema={validationSchema}
          validateOnChange={false} // Chỉ thực hiện validation khi blur
          validateOnBlur={true} // Bật validation khi rời khỏi ô input
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

              <div className={`${styles.Auth_form_forgot}`}>
                <a href="/forgot-password">Forgot password ?</a>
              </div>

              <button type="submit" className={`${styles.Auth_form_button}`}>
                Register
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
          <span>You already have an account ?</span>
          <Link href={paths.LOGIN}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
