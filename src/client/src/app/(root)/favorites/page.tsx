import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import TablePlaylist from "@/components/TablePlaylist";
import { IPlaylist } from "@/types";
import { songs } from "../../../lib/data";
import styles from "./style.module.scss";
import { HeaderPage } from "@/components/HeaderPage";
import { IMAGES } from "@/lib/constants";

const header: IPlaylist = {
  id: "1",
  title: "Favorites",
  description: "",
  image_path: IMAGES.FAVORITES.src,
  owner: [
    {
      id: "1",
      name: "Artist",
      image_path: IMAGES.AVATAR.src,
      followers: 100,
    },
  ],
  createdAt: "",
  public: true,
  followers_count: 0,
  total: 12,
};

const Favorites = () => {
  return (
    <div className={styles.LikesPage}>
      <div className={`${styles.LikesPage_header}`}>
        <HeaderPage data={header} />
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
          <TablePlaylist songs={songs} />
        </div>
      </div>
    </div>
  );
};

export default Favorites;
