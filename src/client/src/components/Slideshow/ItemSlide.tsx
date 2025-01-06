"use client";

import { paths } from "@/lib/constants";
import { apiImage, formatImg } from "@/lib/utils";
import { IRoom } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./style.module.scss";

const SildeItem = ({ data }: { data: IRoom }) => {
  const router = useRouter();
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Khi bắt đầu nhấn chuột
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
    setIsDragging(false); // Reset trạng thái kéo
  };

  // Khi di chuyển chuột
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const distance = Math.hypot(
      e.clientX - startPosition.x,
      e.clientY - startPosition.y
    );

    // Nếu chuột di chuyển một khoảng nhất định (ví dụ: 10px), coi như đang kéo
    if (distance > 10) {
      setIsDragging(true);
    }
  };

  // Khi thả chuột
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) {
      router.push(paths.PLAYLIST + "/123");
    } else {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`heroSlideItem ${styles.SlideItem}`}
      style={{
        backgroundImage: `url(${
          data?.imagePath ? formatImg(apiImage(data?.imagePath)) : ""
        })`,
      }}
    >
      <div
        // onClick={onClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`${styles.SlideItem_content}`}
      >
        {/* <Link href="/song/123" as="/song/123"> */}
        <span className={`${styles.SlideItem_content_genre}`}>
          {data.creator?.name || "Vibely"}
        </span>
        <div>
          <h4 className={`${styles.SlideItem_content_title}`}>
            {data?.title || "Title"}
          </h4>
          <p className={`${styles.SlideItem_content_desc}`}>
            {data?.description || "Description"}
          </p>
        </div>
        <div className={`${styles.SlideItem_content_bottom}`}>
          <button>
            <i className="fa-solid fa-heart"></i>
          </button>
          <span>{data?.membersCount || 0}</span>
        </div>
        {/* </Link> */}
      </div>
      <div className={styles.overlay}></div>
    </div>
  );
};

export default SildeItem;
