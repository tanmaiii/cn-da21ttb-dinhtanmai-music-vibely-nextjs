// "use client";
import React, { useEffect } from "react";
import styles from "./style.module.scss";
import { ButtonIconRound } from "../ui/Button";

interface ModalProps {
  show: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  const modalBodyRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMousedown = (event: MouseEvent) => {
      if (!modalBodyRef.current?.contains(event.target as Node)) {
        props.onClose();
      }
    };
    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  });

  return (
    <div className={`${styles.Modal} ${props.show ? styles.Modal_active : ""}`}>
      <div ref={modalBodyRef} className={`${styles.Modal_swapper}`}>
        <div className={`${styles.Modal_swapper_button}`}>
          <ButtonIconRound
            className={`${styles.Modal_swapper_header_close}`}
            icon={<i className="fa-solid fa-times"></i>}
            onClick={() => props.onClose()}
          />
        </div>
        <div className={`${styles.Modal_swapper_body}`}>{props.children}</div>
      </div>
    </div>
  );
};

export default Modal;
