import React, { useEffect, useRef } from "react";
import styles from "./style.module.scss";

interface Props {
  icon: React.ReactNode;
  title: string;
  itemFunc: () => void;
  children?: React.ReactNode;
}

const ItemMenu = (props: Props) => {
  const { icon, title, itemFunc } = props;
  const MenuRef = useRef<HTMLDivElement>(null);
  const SubmenuRef = useRef<HTMLUListElement>(null);
  const ParentMenuRef = useRef<HTMLButtonElement>(null);
  const [openSubMenu, setOpenSubMenu] = React.useState(false);

  useEffect(() => {
    setOpenSubMenu(false);
    if (MenuRef.current && ParentMenuRef.current && SubmenuRef.current) {
      MenuRef.current.addEventListener("mouseenter", () => {
        setOpenSubMenu(true);
      });
      MenuRef.current.addEventListener("mouseleave", () => {
        setOpenSubMenu(false);
      });
      // SubmenuRef.current.addEventListener("mouseleave", () => {
      //   setOpenSubMenu(false);
      // });
    }
  }, []);

  return (
    <div ref={MenuRef} className={styles.ItemMenu}>
      <button ref={ParentMenuRef} onClick={itemFunc}>
        {icon}
        <span>{title}</span>
      </button>
      <ul
        ref={SubmenuRef}
        className={`${styles.ItemMenu_submenu} 
          ${openSubMenu ? styles.active : ""}`}
      >
        {props.children}
      </ul>
    </div>
  );
};

export default ItemMenu;
