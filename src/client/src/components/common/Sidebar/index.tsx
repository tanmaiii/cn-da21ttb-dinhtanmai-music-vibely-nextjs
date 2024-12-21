"use client";

import { useUI } from "@/context/UIContext";
import { clearUser } from "@/features/userSlice";
import { IMAGES, paths } from "@/lib/constants";
import { RootState } from "@/lib/store";
import tokenService from "@/lib/tokenService";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.scss";
import authService from "@/services/auth.service";

interface SidebarProps {
  links: {
    title: string;
    items: {
      title: string;
      paths: string[];
      icon: string;
    }[];
  }[];
}

const Sidebar = (props: SidebarProps) => {
  const { links } = props;
  const [active, setActive] = React.useState(false);
  const [pathnameActive, setPathnameActive] = React.useState("");
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, theme, toggleDarkMode } = useUI();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // const pathParts = pathname.split("/");
    // const targetValue = `/${pathParts[1]}`;
    setPathnameActive(pathname);
  }, [pathname]);

  useEffect(() => {
    if (isSidebarOpen) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [isSidebarOpen]);

  const handleLogout = () => {
    authService.logout({ refreshToken: tokenService.refreshToken });
    dispatch(clearUser());
  };

  return (
    <>
      <div
        className={`${styles.Sidebar} ${active ? styles.Sidebar_hide : ""} ${
          isSidebarOpen ? styles.Sidebar_OpenMobile : ""
        }`}
      >
        <Link href={paths.HOME} className={`${styles.Sidebar_logo}`}>
          <Image src={IMAGES.LOGO} alt="logo" />
          <h2>Vibely</h2>
        </Link>
        <div className={`${styles.Sidebar_list}`}>
          {links.map((item) => {
            return (
              <div key={item.title}>
                {item.title && (
                  <div className={`${styles.Sidebar_list_title}`}>
                    <hr />
                    <h4>{item.title}</h4>
                  </div>
                )}
                {item.items.map((i, index) => {
                  const isActive = pathnameActive === i.paths[0];
                  return (
                    <Link
                      key={index}
                      data-tooltip={i.title}
                      href={i.paths[0]}
                      className={`${styles.Sidebar_list_item} ${
                        isActive ? styles.Sidebar_list_item_active : ""
                      }`}
                    >
                      <i className={i.icon}></i>
                      <h4>{i.title}</h4>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className={`${styles.Sidebar_footer}`}>
          <div
            className={`${styles.Sidebar_footer_button}`}
            data-tooltip={"Theme"}
            onClick={toggleDarkMode}
          >
            {theme === "light" ? (
              <i className="fa-light fa-sun"></i>
            ) : (
              <i className="fa-light fa-moon-stars"></i>
            )}
            <h4>Theme</h4>
          </div>
          {user && (
            <div
              className={`${styles.Sidebar_footer_button}`}
              data-tooltip={"Logout"}
              onClick={handleLogout}
            >
              <i className="fa-light fa-right-from-bracket"></i>
              <h4>Logout</h4>
            </div>
          )}
          <div
            className={`${styles.Sidebar_footer_button}`}
            onClick={() => toggleSidebar()}
            data-tooltip={isSidebarOpen ? "Show sidebar" : "Hide sidebar"}
          >
            <i className="fa-light fa-sidebar"></i>
            <h4>{isSidebarOpen ? "Show sidebar" : "Hide sidebar"}</h4>
          </div>
        </div>
      </div>
      <div
        onClick={toggleSidebar}
        className={`${styles.Sidebar_overlay} ${
          isSidebarOpen ? styles.Sidebar_overlay_OpenMobile : ""
        }`}
      ></div>
    </>
  );
};

export default Sidebar;
