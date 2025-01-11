import React from "react";
import styles from "./style.module.scss";

interface Props {
  icon: React.ReactNode;
  title: string;
  itemFunc: () => void;
  children?: React.ReactNode;
}

const ItemMenu = (props: Props) => {
  const { icon, title, itemFunc } = props;

  const handleOnClick = () => {
    itemFunc();
  };

  return (
    <div className={styles.ItemMenu}>
      <button onClick={handleOnClick}>
        {icon}
        <span>{title}</span>
      </button>
    </div>
  );
};

export default ItemMenu;
