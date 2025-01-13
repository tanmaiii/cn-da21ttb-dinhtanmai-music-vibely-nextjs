import { usePlayer } from "@/context/PlayerContext";
import { closeMenu } from "@/features/menuSongSlice";
import { useCustomToast } from "@/hooks/useToast";
import { paths } from "@/lib/constants";
import { RootState } from "@/lib/store";
import songService from "@/services/song.service";
import { ISong } from "@/types";
import { SongRequestDto } from "@/types/song.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormCreateSong } from "../Form";
import Modal, { ModalConfirm } from "../Modal";
import ItemMenu from "./ItemMenu";
import AddSongToPlaylist from "./MenuAddSongToPlaylist";
import styles from "./style.module.scss";

const SongMenu = () => {
  const currentUser = useSelector((state: RootState) => state.user);
  const { toastSuccess, toastError } = useCustomToast();
  const menuSong = useSelector((state: RootState) => state.menuSong);
  const { addToQueue, queue, removeFromQueue } = usePlayer();
  const SongMenuRef = useRef<HTMLDivElement>(null);
  const SongMenuContentRef = useRef<HTMLDivElement>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();
  const [placement, setPlacement] = useState<
    "top-start" | "bottom-start" | "top-end" | "bottom-end"
  >("bottom-start");
  const { position } = menuSong;
  const router = useRouter();
  const queryClient = useQueryClient();

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
  }, [position, SongMenuRef, window.innerWidth, window.innerHeight]);

  const mutationDelete = useMutation({
    mutationFn: async (song: ISong) => {
      await songService.delete(song.id);
      return song;
    },
    onSuccess: (song) => {
      dispatch(closeMenu());
      setOpenDelete(false);
      toastSuccess("Delete song successfully");
      queryClient.invalidateQueries({ queryKey: ["song"] });
      queryClient.invalidateQueries({ queryKey: ["song", song.slug] });
      router.push(paths.HOME);
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SongRequestDto }) => {
      const res = await songService.update(id, data);
      return res.data;
    },
    onSuccess: (song) => {
      toastSuccess("Update song success");
      dispatch(closeMenu());
      queryClient.invalidateQueries({ queryKey: ["song"] });
      router.push(paths.SONG + "/" + song.slug);
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

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
              title="Remove to queue"
              itemFunc={() => {
                if (menuSong.song) removeFromQueue(menuSong.song);
                dispatch(closeMenu());
              }}
            />
          )}
          {/* <ItemMenu
            icon={<i className="fa-regular fa-heart"></i>}
            title="Add to favorite"
            itemFunc={() => console.log("Add to favorite")}
          /> */}
          {currentUser?.id === menuSong.song?.creator.id && (
            <>
              <ItemMenu
                icon={<i className="fa-regular fa-trash"></i>}
                title="Delete song"
                itemFunc={() => setOpenDelete(true)}
              />
              <ItemMenu
                icon={<i className="fa-regular fa-pen"></i>}
                title="Edit song"
                itemFunc={() => setOpenEdit(true)}
              />
            </>
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
        {openDelete && menuSong.song && (
          <ModalConfirm
            show={openDelete}
            title="Delete song"
            content="Are you sure you want to delete this song?"
            onConfirm={() =>
              menuSong.song && mutationDelete.mutate(menuSong.song)
            }
            onClose={() => setOpenDelete(false)}
          />
        )}
        {openEdit && menuSong.song && (
          <Modal
            className={styles.modalSong}
            show={openEdit}
            onClose={() => setOpenEdit(false)}
          >
            <FormCreateSong
              file={null}
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              initialData={menuSong.song}
              onSubmit={(data) => {
                if (menuSong.song?.id) {
                  mutationEdit.mutate({ id: menuSong.song.id, data });
                }
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default SongMenu;
