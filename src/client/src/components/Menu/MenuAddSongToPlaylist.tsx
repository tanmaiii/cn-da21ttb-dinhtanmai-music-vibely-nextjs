import { IMAGES } from "@/lib/constants";
import { apiImage } from "@/lib/utils";
import playlistService from "@/services/playlist.service";
import { IPlaylist, ISong } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui";
import styles from "./style.module.scss";
import { useCustomToast } from "@/hooks/useToast";

interface Props {
  song: ISong;
  closeMenu?: () => void;
}

const AddSongToPlaylist = ({ song }: Props) => {
  const subMenuRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");

  // Vị trí của sub menu
  useEffect(() => {
    const rest = subMenuRef.current?.getBoundingClientRect();
    if (subMenuRef.current && rest) {
      subMenuRef.current.style.display = `none`;
      if (rest?.right + rest?.width > window.innerWidth - 20) {
        subMenuRef.current.style.right = `100%`;
        subMenuRef.current.style.left = `unset`;
        subMenuRef.current.style.display = `flex`;
        return;
      } else {
        subMenuRef.current.style.left = `${rest?.width - 10}px`;
        subMenuRef.current.style.right = `unset`;
        subMenuRef.current.style.display = `flex`;
        return;
      }
    }
  }, [subMenuRef]);

  const { data: playlists } = useQuery({
    queryKey: ["my-playlist", keyword],
    queryFn: async () => {
      const res = await playlistService.getMe({
        page: 1,
        limit: 0,
        my: "true",
        keyword,
      });
      return res.data.data;
    },
    // staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  return (
    <>
      <div ref={subMenuRef} className={styles.SubMenu_addSong}>
        <div className={styles.SubMenu_addSong_search}>
          <i className="fa-light fa-magnifying-glass"></i>
          <Input
            placeholder="Tìm kiếm playlist"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* <button className={styles.SubMenu_addSong_item}>
          <i className="fa-light fa-plus"></i>
          <div className={styles.SubMenu_addSong_item_info}>
            <span>Thêm playlist</span>
          </div>
        </button> */}

        <hr />

        {playlists && song && playlists?.length > 0 ? (
          playlists.map((playlist, index) => (
            <ItemPlaylist song={song} key={index} playlist={playlist} />
          ))
        ) : (
          <span className={styles.noResult}>No result</span>
        )}
      </div>
      {/* <Modal
          title={"Thêm playlist mới"}
          openModal={openModalAddPlaylist}
          setOpenModal={setOpenModalAddPlaylist}
        >
          <AddPlaylist
            openModal={openModalAddPlaylist}
            closeModal={() => setOpenModalAddPlaylist(false)}
          />
        </Modal> */}
    </>
  );
};

export default AddSongToPlaylist;

interface ItemPlaylistProps {
  playlist: IPlaylist;
  song: ISong;
}

const ItemPlaylist = (props: ItemPlaylistProps) => {
  const { playlist, song } = props;
  const { toastError, toastSuccess } = useCustomToast();
  const queryClient = useQueryClient();

  const { data: isAdd } = useQuery({
    queryKey: ["check-song-to-playlist", playlist.id],
    queryFn: async () => {
      const res = await playlistService.checkSongToPlaylist(playlist.id, {
        songId: song.id,
      });
      return res.data;
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (isAdd: boolean) => {
      if (isAdd) {
        await playlistService.removeSongFromPlaylist(playlist.id, {
          songIds: [song.id],
        });
        toastSuccess("Remove song from playlist successfully");
      } else {
        await playlistService.addSongToPlaylist(playlist.id, {
          songIds: [song.id],
        });
        toastSuccess("Add song to playlist successfully");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-song-to-playlist", playlist.id],
      });
    },
    onError: (error: unknown) => {
      toastError((error as Error).message);
    },
  });

  return (
    <button
      className={styles.SubMenu_addSong_item}
      onClick={() => mutationAdd.mutate(isAdd ?? false)}
    >
      {/* <i className="fa-light fa-list-music"></i> */}
      <Image
        src={
          playlist.imagePath ? apiImage(playlist.imagePath) : IMAGES.PLAYLIST
        }
        width={30}
        height={30}
        alt="playlist thumbnail"
      />
      <div className={styles.SubMenu_addSong_item_info}>
        <span>{playlist.title}</span>
      </div>

      {isAdd ? (
        <>
          <i className={`${styles.icon_remove} fa-solid fa-circle-xmark`}></i>
          <i className={`${styles.icon_check} fa-solid fa-circle-check`}></i>
        </>
      ) : (
        <i className={`${styles.icon_add} fa-solid fa-circle-plus`}></i>
      )}
    </button>
  );
};
