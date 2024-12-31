"use client";

import { HeaderPage } from "@/components/HeaderPage";
import TablePlaylist from "@/components/TablePlaylist";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { exFavorites } from "../../../lib/data";
import styles from "./style.module.scss";
import { useQuery } from "@tanstack/react-query";
import songService from "@/services/song.service";
import { notFound } from "next/navigation";
import Loading from "./loading";
import { Track } from "@/components/Track";

const Favorites = () => {
  // const [isLoading, setisLoading] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["song-favorites"],
    queryFn: async () => {
      const res = await songService.getAllSongLiked();
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  if (error) return notFound();

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
            icon={<i className="fa-solid fa-ellipsis"></i>}
          />
        </div>

        <div className={`${styles.LikesPage_content_body}`}>
          {data && (
            <TablePlaylist
              data={data}
              renderItem={(item, index) => <Track key={index} song={item} />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
