import { closeMenu } from "@/features/menuPlaylistSlice";
import { useCustomToast } from "@/hooks/useToast";
import { paths } from "@/lib/constants";
import { RootState } from "@/lib/store";
import playlistService from "@/services/playlist.service";
import { IPlaylist, PlaylistRequestDto } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormPlaylist } from "../Form";
import Modal, { ModalConfirm } from "../Modal";
import ItemMenu from "./ItemMenu";
import styles from "./style.module.scss";

const PlaylistMenu = () => {
  const currentUser = useSelector((state: RootState) => state.user);
  const { toastSuccess, toastError } = useCustomToast();
  const menuPlaylist = useSelector((state: RootState) => state.menuPlaylist);
  const PlaylistMenuRef = useRef<HTMLDivElement>(null);
  const PlaylistMenuContentRef = useRef<HTMLDivElement>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();
  const { position } = menuPlaylist;
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        PlaylistMenuRef.current &&
        !PlaylistMenuRef.current.contains(e.target as Node)
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
    if (PlaylistMenuRef.current && position && PlaylistMenuContentRef.current) {
      const menu = PlaylistMenuRef.current;
      const content = PlaylistMenuContentRef.current;
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
          menu.style.top = `${top + (height ?? 200)}px`;
          menu.style.left = `${left - contentWidth + (width ?? 200)}px`;
        } else {
          menu.style.left = `${left - contentWidth + (width ?? 200)}px`;
          menu.style.bottom = `${windowHeight - top}px`;
        }
      } else {
        if (top + contentHeight > windowHeight - 200) {
          menu.style.top = `${top - contentHeight}px`;
          menu.style.left = `${left}px`;
        } else {
          menu.style.top = `${top + (height ?? 200)}px`;
          menu.style.left = `${left}px`;
        }
      }
    }
  }, [position, PlaylistMenuRef, window.innerWidth, window.innerHeight]);

  const mutationDelete = useMutation({
    mutationFn: async (playlist: IPlaylist) => {
      await playlistService.delete(playlist.id);
      return playlist;
    },
    onSuccess: (playlist) => {
      dispatch(closeMenu());
      setOpenDelete(false);
      toastSuccess("Delete playlist successfully");
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlist.slug] });
      router.push(paths.MY_PLAYLIST);
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: PlaylistRequestDto;
    }) => {
      const res = await playlistService.update(id, data);
      return res.data;
    },
    onSuccess: (playlist) => {
      toastSuccess("Update playlist success");
      dispatch(closeMenu());
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
      router.push(paths.PLAYLIST + "/" + playlist.slug);
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

  if (!menuPlaylist.playlist) return null;

  return (
    <div
      ref={PlaylistMenuRef}
      className={`${styles.PlaylistMenu} ${
        menuPlaylist.open ? styles.active : ""
      }`}
    >
      <div
        ref={PlaylistMenuContentRef}
        className={`${styles.PlaylistMenu_context} `}
      >
        <div className={`${styles.PlaylistMenu_context_list} `}>
          {currentUser?.id === menuPlaylist.playlist?.creator.id && (
            <>
              <ItemMenu
                icon={<i className="fa-regular fa-trash"></i>}
                title="Delete playlist"
                itemFunc={() => setOpenDelete(true)}
              />
              <ItemMenu
                icon={<i className="fa-regular fa-pen"></i>}
                title="Edit playlist"
                itemFunc={() => setOpenEdit(true)}
              />
              <hr />
            </>
          )}
          <ItemMenu
            title={"See details"}
            icon={<i className="fa-regular fa-music"></i>}
            itemFunc={() => {
              router.push(`${paths.SONG}/${menuPlaylist.playlist?.slug}`);
              dispatch(closeMenu());
            }}
          />
          <ItemMenu
            title={"Artist Access"}
            icon={<i className="fa-regular fa-user"></i>}
            itemFunc={() => {
              router.push(
                `${paths.ARTIST}/${menuPlaylist?.playlist?.creator.slug}`
              );
              dispatch(closeMenu());
            }}
          />
        </div>
        {openDelete && menuPlaylist.playlist && (
          <ModalConfirm
            show={openDelete}
            title="Delete song"
            content="Are you sure you want to delete this song?"
            onConfirm={() =>
              menuPlaylist.playlist &&
              mutationDelete.mutate(menuPlaylist.playlist)
            }
            onClose={() => setOpenDelete(false)}
          />
        )}
        {openEdit && menuPlaylist.playlist && (
          <Modal
            className={styles.modalSong}
            show={openEdit}
            onClose={() => setOpenEdit(false)}
          >
            <FormPlaylist
              initialData={menuPlaylist.playlist}
              onSubmit={(data) =>
                menuPlaylist.playlist &&
                mutationEdit.mutate({
                  id: menuPlaylist.playlist.id,
                  data,
                })
              }
              open={openEdit}
              onClose={() => setOpenEdit(false)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PlaylistMenu;
