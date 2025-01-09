import React from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import { paths } from "@/lib/constants";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const data = [
  //     {
  //       title:"Account",
  //       items: [
  //         {
  //           id: 1,
  //           title:"Personal information",
  //           icon: <i className="fa-thin fa-circle-user"></i>,
  //           path: paths.SETTINGS + paths.ACCOUNT,
  //           item: Account,
  //         },
  //         {
  //           id: 2,
  //           title:"Password and security",
  //           icon: <i className="fa-light fa-shield-halved"></i>,
  //           path: paths.SETTINGS + paths.CHANGE_PASSWORD,
  //           item: Password,
  //         },
  //         {
  //           id: 3,
  //           title:"Identity verification",
  //           icon: <i className="fa-sharp-duotone fa-light fa-badge-check"></i>,
  //           path: paths.SETTINGS + "/verify",
  //           item: Account,
  //         },
  //       ],
  //     },
  //     {
  //       title:"Display mode",
  //       items: [
  //         {
  //           id: 3,
  //           title:"Notifications",
  //           icon: <i className="fa-light fa-bell"></i>,
  //           path: paths.SETTINGS + paths.NOTIFY,
  //           item: Account,
  //         },
  //         {
  //           id: 4,
  //           title:"Language",
  //           icon: <i className="fa-sharp fa-light fa-globe"></i>,
  //           path: paths.SETTINGS + paths.LANGUAGES,
  //           item: Account,
  //         },
  //         {
  //           id: 4,
  //           title:"Dark mode",
  //           icon: <i className="fa-light fa-moon"></i>,
  //           path: paths.SETTINGS + paths.DARK_MODE,
  //           item: Account,
  //         },
  //       ],
  //     },
  //     {
  //       title:"Other information and support",
  //       items: [
  //         {
  //           id: 5,
  //           title:"Help",
  //           icon: <i className="fa-light fa-circle-question"></i>,
  //           path: paths.SETTINGS + paths.HELP,
  //           item: Account,
  //         },
  //         {
  //           id: 6,
  //           title:"Account status",
  //           icon: <i className="fa-light fa-user"></i>,
  //           path: paths.SETTINGS + paths.STATUS,
  //           item: Account,
  //         },
  //       ],
  //     },
  //   ];

  return (
    <div className={styles.Settings_layout}>
      <div className={"row"}>
        <div className={`col pc-3 t-3 m-0`}>
          <div className={styles.Settings_layout_nav}>
            <div className={styles.group}>
              <div className={styles.group_title}>Account</div>
              <div className={styles.group_items}>
                <Link href={paths.SETTINGS} className={styles.item}>
                  <i className="fa-light fa-circle-user"></i>
                  <span>Personal information</span>
                </Link>
                <Link  href={paths.SETTINGS + paths.PASSWORD}  className={styles.item}>
                  <i className="fa-light fa-shield-halved"></i>
                  <span>Password and security</span>
                </Link>
                <Link  href={paths.SETTINGS}  className={styles.item}>
                  <i className="fa-light fa-badge-check"></i>
                  <span>Identity verification</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={` col pc-9 t-9 m-12`}>
          <div className={`${styles.Settings_layout_content}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
