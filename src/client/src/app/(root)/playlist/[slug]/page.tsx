"use client";

import EditPlaylist from "@/components/EditPlaylist";
import { HeaderPage } from "@/components/HeaderPage";
import Modal from "@/components/Modal";
import Table from "@/components/TablePlaylist";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import playlistService from "@/services/playlist.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";

const PlaylistPage = () => {
  const [showEdit, setShowEdit] = useState(false);
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { data, isLoading } = useQuery({
    queryKey: ["playlist", slug],
    queryFn: async () => {
      const res = await playlistService.getBySlug(slug);
      return res.data;
    },
  });

  const { data: dataSong, isLoading: isLoadingSong } = useQuery({
    queryKey: ["playlist", data?.id, "song"],
    queryFn: async () => {
      const res = data && (await playlistService.getAllSongs(data.id));
      return res?.data;
    },
  });

  if (isLoading || isLoadingSong) return <Loading />;

  return (
    <div className={`${styles.PlaylistPage}`}>
      <div className={`${styles.PlaylistPage_header}`}>
        {data && (
          <HeaderPage data={data} onEdit={() => setShowEdit(true)} />
        )}
      </div>
      <div className={`${styles.PlaylistPage_content}`}>
        <div className={`${styles.PlaylistPage_content_header}`}>
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

        <div className={`${styles.PlaylistPage_content_body}`}>
          {dataSong && <Table data={dataSong} />}
        </div>
      </div>
      <Modal show={showEdit} onClose={() => setShowEdit(false)}>
        <EditPlaylist />
      </Modal>
    </div>
  );
};

export default PlaylistPage;
