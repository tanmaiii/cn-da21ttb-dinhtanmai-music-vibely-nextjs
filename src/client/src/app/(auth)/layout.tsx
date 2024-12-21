import { IMAGES, paths } from "@/lib/constants";
import image from "@/public/images/10521038.png";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./auth.module.scss";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | Vibely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className={`${styles.AuthLayout} row no-gutters`}>
      <Link href={paths.HOME} className={`${styles.AuthLayout_logo}`}>
        <Image src={IMAGES.LOGO} alt="logo" />
        <h2>Vibely</h2>
      </Link>
      <div className="col pc-6 t-5 m-0">
        <div className={`${styles.AuthLayout_image} `}>
          <div className={styles.AuthLayout_image_text}>
            <h1>Music for Everyone</h1>
            <span>
              Listen to Music Together - Connect with Friends, Share Your
              Favorite Tunes, Chat and Make Music Your Way
            </span>
          </div>
          <Image src={image} alt="" />
        </div>
      </div>
      <div className=" col pc-6 t-7 m-12">
        <div className={`${styles.AuthLayout_main}`}>{children}</div>
      </div>
    </div>
  );
}
