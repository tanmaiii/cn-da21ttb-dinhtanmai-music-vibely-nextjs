import { HeaderPage } from "@/components/HeaderPage";
import TablePlaylist from "@/components/TablePlaylist";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { exFavorites, songs } from "../../../lib/data";
import styles from "./style.module.scss";

const Favorites = () => {
  // const currentUser = useSelector((state: RootState) => state.user);


  return (
    <div className={styles.LikesPage}>
      <div className={`${styles.LikesPage_header}`}>
        <HeaderPage isFavorites data={exFavorites} />
      </div>
      <div className={`${styles.LikesPage_content}`}>
        <div className={`${styles.LikesPage_content_header}`}>
          <ButtonIconPrimary
            size="large"
            icon={<i className="fa-solid fa-play"></i>}
          />
          <ButtonIcon
            size="large"
            icon={
              <i style={{ color: "#ff6337" }} className="fa-solid fa-heart"></i>
            }
          />
          <ButtonIcon
            size="large"
            icon={<i className="fa-solid fa-ellipsis"></i>}
          />
        </div>

        <div className={`${styles.LikesPage_content_body}`}>
          <TablePlaylist data={songs} />
        </div>
      </div>
    </div>
  );
};

export default Favorites;
