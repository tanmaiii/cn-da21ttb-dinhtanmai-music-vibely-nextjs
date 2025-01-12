import { usePlayer } from "@/context/PlayerContext";
import { closeMenu } from "@/features/menuSongSlice";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import ItemMenu from "./ItemMenu";
import styles from "./style.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { paths } from "@/lib/constants";
import AddSongToPlaylist from "./MenuAddSongToPlaylist";

const SongMenu = () => {
  //   const currentUser = useSelector((state: RootState) => state.user);
  const menuSong = useSelector((state: RootState) => state.menuSong);
  const { addToQueue, queue, removeFromQueue } = usePlayer();
  const SongMenuRef = useRef<HTMLDivElement>(null);
  const SongMenuContentRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [placement, setPlacement] = useState<
    "top-start" | "bottom-start" | "top-end" | "bottom-end"
  >("bottom-start");
  const { position } = menuSong;
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        SongMenuRef.current &&
        !SongMenuRef.current.contains(e.target as Node)
      ) {
        dispatch(closeMenu());
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  // hiển thị menu bài hát
  useEffect(() => {
    if (SongMenuRef.current && position && SongMenuContentRef.current) {
      const menu = SongMenuRef.current;
      const content = SongMenuContentRef.current;
      const { left, top, width, height } = position;
      const menuWidth = menu.clientWidth;
      const menuHeight = menu.clientHeight;
      const contentWidth = content.clientWidth;
      const contentHeight = content.clientHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      menu.style.top = "unset";
      menu.style.left = "unset";
      menu.style.right = "unset";
      menu.style.bottom = "unset";

      if (left + menuWidth > windowWidth - 200) {
        if (top + menuHeight < windowHeight - 200) {
          setPlacement("bottom-end");
          menu.style.top = `${top + (height ?? 200)}px`;
          menu.style.left = `${left - contentWidth + (width ?? 200)}px`;
        } else {
          setPlacement("top-end");
          menu.style.left = `${left - contentWidth + (width ?? 200)}px`;
          menu.style.bottom = `${windowHeight - top}px`;
        }
      } else {
        if (top + contentHeight > windowHeight - 200) {
          setPlacement("top-start");
          menu.style.top = `${top - contentHeight}px`;
          menu.style.left = `${left}px`;
        } else {
          setPlacement("bottom-start");
          menu.style.top = `${top + (height ?? 200)}px`;
          menu.style.left = `${left}px`;
        }
      }
    }
  }, [position, SongMenuRef]);

  if (!menuSong.song) return null;
  return (
    <div
      data-placement={placement}
      ref={SongMenuRef}
      className={`${styles.SongMenu} ${menuSong.open ? styles.active : ""}`}
    >
      <div ref={SongMenuContentRef} className={`${styles.SongMenu_context} `}>
        <div className={`${styles.SongMenu_context_list} `}>
          <ItemMenu
            icon={<i className="fa-solid fa-plus"></i>}
            title="Add to playlist"
            itemFunc={() => {}}
          >
            <AddSongToPlaylist song={menuSong.song} />
          </ItemMenu>
          {!queue.includes(menuSong.song) ? (
            <ItemMenu
              icon={<i className="fa-regular fa-list-music"></i>}
              title="Add to queue"
              itemFunc={() => {
                if (menuSong.song) addToQueue(menuSong.song);
                dispatch(closeMenu());
              }}
            />
          ) : (
            <ItemMenu
              icon={<i className="fa-light fa-trash"></i>}
              title="Add to queue"
              itemFunc={() => {
                if (menuSong.song) removeFromQueue(menuSong.song);
                dispatch(closeMenu());
              }}
            />
          )}
          <hr />
          <ItemMenu
            title={"See details"}
            icon={<i className="fa-regular fa-music"></i>}
            itemFunc={() => router.push(`${paths.SONG}/${menuSong.song?.slug}`)}
          />
          <ItemMenu
            title={"Artist Access"}
            icon={<i className="fa-regular fa-user"></i>}
            itemFunc={() =>
              router.push(`${paths.ARTIST}/${menuSong?.song?.creator.slug}`)
            }
          />
          <ItemMenu
            title={"Share"}
            icon={<i className="fa-light fa-arrow-up-from-bracket"></i>}
            itemFunc={() => console.log("Add to playlist")}
          />
        </div>
      </div>
    </div>
  );
};

export default SongMenu;
