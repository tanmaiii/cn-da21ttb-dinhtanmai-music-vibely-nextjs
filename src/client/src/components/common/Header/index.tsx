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
import { paths } from "@/lib/constants";
import profilePic from "@/public/images/anime.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import styles from "./style.module.scss";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const Header = () => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [isShrink, setIsShrink] = React.useState<boolean>(false);
  const { toggleSidebar } = useUI();
  const [activeModal, setActiveModal] = React.useState<boolean>(false);
  const [keyword, setKeyword] = React.useState<string>("");
  const router = useRouter();
  const { toastSuccess } = useCustomToast();
  const user = useSelector((state: RootState) => state.user);

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
                onClick={() => handleSearch("")}
              />
            )}
          </div>
        </div>
        <div className={`${styles.Header_right}`}>
          <ButtonIconRound
            icon={<i className="fa-regular fa-upload"></i>}
            onClick={() => router.push(paths.UPLOAD)}
          />
          <ButtonIconRound
            onClick={() => toastSuccess("Hello")}
            icon={<i className="fa-regular fa-gear"></i>}
          />
          <ButtonIconRound
            icon={<i className="fa-regular fa-bell"></i>}
            onClick={() => setActiveModal(true)}
          />
          {user ? (
            <div className={`${styles.Header_right_user}`}>
              <button className={`${styles.Header_right_user_image}`}>
                <Image
                  src={profilePic}
                  alt="avatar"
                  width={40}
                  height={40}
                  quality={50}
                />
              </button>
            </div>
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
