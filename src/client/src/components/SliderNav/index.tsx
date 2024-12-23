import React, { useEffect } from "react";
import styles from "./style.module.scss";
import { ISort } from "@/types";

interface nav {
  id: number;
  name: string;
  value: ISort;
}

interface Props {
  listNav: nav[];
  active: ISort;
  setActive: (value: ISort) => void;
}

const SliderNav = (props: Props) => {
  const { listNav, active, setActive } = props;

  useEffect(() => {
    const tabs = document.querySelector(".tabs");
    const icons = document.querySelectorAll(".icon i");

    // Xử lý ẩn hiện nút icon
    const handleIcons = () => {
      const scrollVal = Math.round(tabs?.scrollLeft ?? 0);
      const maxScroll = (tabs?.scrollWidth ?? 0) - (tabs?.clientWidth ?? 0);
      if (scrollVal !== undefined) {
        icons[0].parentElement!.style.display =
          scrollVal > 0 ? "block" : "none";
        icons[1].parentElement!.style.display =
          maxScroll > scrollVal ? "block" : "none";
      }
    };

    // Sự kiện click vào nút
    icons.forEach((icon) => {
      icon.addEventListener("click", () => {
        if (tabs) {
          tabs.scrollLeft += icon.id === "left" ? -350 : 350;
          setTimeout(() => {
            handleIcons();
          }, 50);
        }
      });
    });

    // Sự kiện nhấn giữ scroll slider
    const dragging = (e: Event) => {
      if (tabs) {
        const mouseEvent = e as MouseEvent;
        tabs.scrollLeft -= mouseEvent.movementX;
        tabs.classList.add(`${styles.dragging}`);
        handleIcons();
      }
    };

    tabs?.addEventListener("mousedown", () => {
      tabs?.addEventListener("mousemove", dragging as EventListener);
      tabs?.addEventListener("mouseup", () => {
        tabs?.removeEventListener("mousemove", dragging as EventListener);
        tabs.classList.remove(`${styles.dragging}`);
      });
    });
  }, []);

  return (
    <div>
      <div className={`${styles.SliderNav} slider-nav`}>
        <button className="icon">
          <i id="left" className="fa-solid fa-chevron-left"></i>
        </button>
        <ul className={"tabs"}>
          {listNav.map((item, index) => (
            <li
              key={index}
              className={`tab ${active === item.value ? styles.active : ""} `}
              onClick={() => {
                setActive(item.value);
              }}
            >
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
        <button className="icon">
          <i id="right" className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default SliderNav;
