import React from "react";
import styles from "./auth.module.scss";
import Image from "next/image";
import { IMAGES, paths } from "@/lib/constants";
import Link from "next/link";

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
      <div className={`${styles.AuthLayout_image} col pc-6 t-5 m-0`}>
       
        {/* <Image src={IMAGES.AVATAR} alt="" /> */}
      </div>
      <div className={`${styles.AuthLayout_main} col pc-6 t-7 m-12`}>{children}</div>
    </div>
  );
}
