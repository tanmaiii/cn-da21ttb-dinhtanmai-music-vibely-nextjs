"use client";

import Modal from "@/components/Modal";
import {
  ButtonIcon,
  ButtonIconRound,
  ButtonLabel,
} from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useUI } from "@/context/UIContext";
import { useCustomToast } from "@/hooks/useToast";
import { IMAGES, paths, PERMISSIONS, ROLES } from "@/lib/constants";
import { RootState } from "@/lib/store";
import { apiImage, hasPermission } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";

const Header = () => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [isShrink, setIsShrink] = React.useState<boolean>(false);
  const { toggleSidebar } = useUI();
  const [activeModal, setActiveModal] = React.useState<boolean>(false);
  const [keyword, setKeyword] = React.useState<string>("");
  const router = useRouter();
  const { toastSuccess } = useCustomToast();
  const currentUser = useSelector((state: RootState) => state.user);
  const params = useParams();
  const searchTerm = decodeURIComponent((params.keyword as string) || "");

  useEffect(() => {
    const body = document.querySelector(".RootLayout_main");

    const handleScrollHeader = () => {
      const scrollTop =
        (body as HTMLElement).scrollTop || document.documentElement.scrollTop;

      if (scrollTop == 0) {
        setIsShrink(false);
      } else {
        setIsShrink(true);
      }
    };

    if (body) {
      body.addEventListener("scroll", handleScrollHeader);
    }

    return () => {
      if (body) {
        body.removeEventListener("scroll", handleScrollHeader);
      }
    };
  });

  const handleSearch = (value: string) => {
    setKeyword(value);
    router.push(`${paths.SEARCH}/${value}`);
  };

  useEffect(() => {
    if (keyword !== searchTerm) {
      setKeyword(searchTerm);
    }
  }, [searchTerm]);

  return (
    <>
      <div
        ref={headerRef}
        className={`${styles.Header} ${isShrink ? styles.Header_shrink : ""}`}
      >
        <div className={`${styles.Header_left}`}>
          <ButtonIconRound
            className={`${styles.Header_left_BtnSidebar}`}
            icon={<i className="fa-light fa-bars"></i>}
            onClick={() => toggleSidebar()}
          />
          <div className={`${styles.Header_left_search}`}>
            <button>
              <i className="fa-regular fa-magnifying-glass"></i>
            </button>
            <Input
              value={keyword}
              type="text"
              placeholder="Search"
              onSubmit={handleSearch}
            />
            {keyword && (
              <ButtonIcon
                size="small"
                icon={<i className="fa-regular fa-times"></i>}
                onClick={() => {
                  router.push(paths.SEARCH);
                  handleSearch("");
                }}
              />
            )}
          </div>
        </div>
        <div className={`${styles.Header_right}`}>
          {hasPermission(
            currentUser?.role.permissions,
            PERMISSIONS.CREATE_SONGS
          ) && (
            <ButtonIconRound
              icon={<i className="fa-regular fa-upload"></i>}
              onClick={() => router.push(paths.SONG + paths.CREATE)}
            />
          )}
          <ButtonIconRound
            onClick={() => toastSuccess("Hello")}
            icon={<i className="fa-regular fa-gear"></i>}
          />
          <ButtonIconRound
            icon={<i className="fa-regular fa-bell"></i>}
            onClick={() => setActiveModal(true)}
          />
          {currentUser ? (
            <UserDropDown />
          ) : (
            <ButtonLabel
              className={`${styles.Header_right_BtnLogout}`}
              size="small"
              onClick={() => router.push(paths.LOGIN)}
            >
              <label htmlFor="">
                <span>Login</span>
              </label>
            </ButtonLabel>
          )}
        </div>
      </div>
      <Modal show={activeModal} onClose={() => setActiveModal(false)}>
        Xin chao
      </Modal>
    </>
  );
};

export default Header;

const UserDropDown = () => {
  const currentUser = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [active, setActive] = React.useState<boolean>(false);
  const dropdownRef = useRef<HTMLInputElement>(null);

  // const handleLogout = () => {
  //   router.push(paths.HOME);
  // };

  useEffect(() => {
    function handleMousedown(event: MouseEvent) {
      const node = event.target as Node;
      if (!dropdownRef.current?.contains(node)) {
        setActive(false);
      }
    }
    document.addEventListener("mousedown", (event) => handleMousedown(event));
    return () =>
      document.removeEventListener("mousedown", (event) =>
        handleMousedown(event)
      );
  });

  if (!currentUser) return null;

  return (
    <div ref={dropdownRef} className={`${styles.Header_right_user}`}>
      <button
        onClick={() => setActive(!active)}
        className={`${styles.Header_right_user_image} ${
          currentUser.role?.name === ROLES.ARTIST &&
          styles.Header_right_user_image_artist
        }  ${
          currentUser.role?.name === ROLES.ADMIN &&
          styles.Header_right_user_image_admin
        } 
                  `}
      >
        <Image
          src={
            currentUser?.imagePath
              ? apiImage(currentUser.imagePath)
              : IMAGES.AVATAR
          }
          alt="avatar"
          width={40}
          height={40}
          quality={50}
        />
      </button>

      {active && (
        <div className={`${styles.Header_right_user_dropdown}`}>
          <Link
            href={paths.ARTIST + "/" + currentUser.slug}
            className={`${styles.Header_right_user_dropdown_info}`}
          >
            <Image
              src={
                currentUser?.imagePath
                  ? apiImage(currentUser.imagePath)
                  : IMAGES.AVATAR
              }
              alt="avatar"
              width={40}
              height={40}
              quality={50}
            />
            <div>
              <h4>{currentUser.name}</h4>
              <p>{currentUser?.role?.name.toUpperCase()}</p>
            </div>
          </Link>
          <button
            onClick={() => router.push(paths.SETTINGS)}
            className={`${styles.Header_right_user_dropdown_item}`}
          >
            <i className="fa-light fa-gear"></i>
            <span>Settings</span>
          </button>
          {currentUser?.role?.name === ROLES.ADMIN && (
            <button
              onClick={() => router.push(paths.ADMIN)}
              className={`${styles.Header_right_user_dropdown_item}`}
            >
              <i className="fa-regular fa-chart-line"></i>
              <span>Dashboard</span>
            </button>
          )}
          <button
            onClick={() => router.push(paths.LOGOUT)}
            className={`${styles.Header_right_user_dropdown_item}`}
          >
            <i className="fa-light fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
