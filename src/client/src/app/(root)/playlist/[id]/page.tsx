"use client";

import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { HeaderPage } from "@/components/HeaderPage";
import Table from "@/components/TablePlaylist";
import styles from "./style.module.scss";
import { playlists, songs } from "@/lib/data";
import Modal from "@/components/Modal";
import { useState } from "react";
import EditPlaylist from "@/components/EditPlaylist";

const PlaylistPage = () => {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div className={`${styles.PlaylistPage}`}>
      <div className={`${styles.PlaylistPage_header}`}>
        <HeaderPage data={playlists[0]} onEdit={() => setShowEdit(true)} />
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
          <Table songs={songs} />
        </div>
      </div>
      <Modal show={showEdit} onClose={() => setShowEdit(false)}>
        <EditPlaylist />
      </Modal>
    </div>
  );
};

export default PlaylistPage;
