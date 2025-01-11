import { useSelector } from "react-redux";
import ItemMenu from "./ItemMenu";
import styles from "./style.module.scss";
import { RootState } from "@/lib/store";
import { usePlayer } from "@/context/PlayerContext";
import { useDispatch } from "react-redux";
import { closeMenu } from "@/features/menuSongSlice";

const SongMenu = () => {
  //   const currentUser = useSelector((state: RootState) => state.user);
  const menuSong = useSelector((state: RootState) => state.menuSong);
  const { addToQueue, queue, removeFromQueue } = usePlayer();
  const dispatch = useDispatch();

  if (!menuSong.song) return null;
  return (
    <div className={`${styles.SongMenu} ${menuSong.open ? styles.active : ""}`}>
      <div className={`${styles.SongMenu_context} `}>
        <div className={`${styles.SongMenu_context_list} `}>
          <ItemMenu
            icon={<i className="fa-solid fa-plus"></i>}
            title="Add to playlist"
            itemFunc={() => {}}
          ></ItemMenu>
          {!queue.includes(menuSong.song) ? (
            <ItemMenu
              icon={<i className="fa-regular fa-list-music"></i>}
              title="Add to queue"
              itemFunc={() => {
                if (menuSong.song) addToQueue(menuSong.song);
                dispatch(closeMenu());
              }}
            ></ItemMenu>
          ) : (
            <ItemMenu
              icon={<i className="fa-light fa-trash"></i>}
              title="Add to queue"
              itemFunc={() => {
                if (menuSong.song) removeFromQueue(menuSong.song);
                dispatch(closeMenu());
              }}
            ></ItemMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongMenu;
