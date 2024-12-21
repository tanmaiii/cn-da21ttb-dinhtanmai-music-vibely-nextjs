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

const Login = () => {
  const router = useRouter();
  const dispath = useDispatch();
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<LoginRequestDto>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginRequestDto>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors: LoginRequestDto = { email: "", password: "" };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { data } = await authService.login(formData);
      tokenService.accessToken = data.accessToken;
      tokenService.refreshToken = data.refreshToken;
      dispath(setUser(data));
      router.push("/");
      toast.success("Login successfully");
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || "Login failed");
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
      dispath(setUser(data));
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
          inventore ut qui
        </span>
      </div>
      <div className={`${styles.Auth_form}`}>
        {error && <div className={`${styles.Auth_form_error}`}>{error}</div>}
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
        <button onClick={handleSubmit} className={`${styles.Auth_form_button}`}>
          Login
        </button>

        <hr />

        <GoogleLogin
          onSuccess={(res) => handleSuccessLoginGoogle(res)}
          onError={() => {
            toast.error("Login with google failed");
          }}
        />
        <div className={`${styles.Auth_form_redirect}`}>
          <span>Don&apos;t have an account?</span>
          <Link href={paths.REGISTER}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
