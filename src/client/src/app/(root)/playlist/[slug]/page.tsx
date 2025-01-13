"use client";

import { HeaderPage } from "@/components/HeaderPage";
import Modal from "@/components/Modal";
import Table from "@/components/TablePlaylist";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/useToast";
import { RootState } from "@/lib/store";
import playlistService from "@/services/playlist.service";
import { ISong, PlaylistRequestDto } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import { FormPlaylist } from "@/components/Form";
import { Track } from "@/components/Track";
import { PlaylistRequestUpdateDto } from "@/types/playlist.type";
import Loading from "./loading";
import Empty from "@/components/common/Empty";
import { usePlayer } from "@/context/PlayerContext";
import { useDispatch } from "react-redux";
import { closeMenu, openMenu } from "@/features/menuPlaylistSlice";

const PlaylistPage = () => {
  const [showEdit, setShowEdit] = useState(false);
  const { toastError, toastSuccess } = useCustomToast();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const currentUser = useSelector((state: RootState) => state.user);
  const menuPlaylist = useSelector((state: RootState) => state.menuPlaylist);
  const { currentSong, isPlaying, play, pause, playPlaylist } = usePlayer();
  const queryClient = useQueryClient();
  const btnRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  const {
    data: playlist,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["playlist", slug],
    queryFn: async () => {
      const res = await playlistService.getBySlug(slug);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  const { data: dataSong } = useQuery({
    queryKey: ["playlist-song", playlist?.id],
    queryFn: async () => {
      const res =
        playlist &&
        playlist?.songsCount > 0 &&
        (await playlistService.getAllSongs(playlist?.id));
      return res ? res.data : null;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  const onSubmitEdit = useMutation({
    mutationFn: async (data: PlaylistRequestDto) => {
      const res =
        playlist && (await playlistService.update(playlist?.id, data));
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", slug] });
      toastSuccess("Update playlist success");
      setShowEdit(false);
    },
    onError: () => {
      toastError("Update playlist error");
    },
  });

  const mutationUpdatePlaylist = useMutation({
    mutationFn: async (data: PlaylistRequestUpdateDto) => {
      if (playlist?.id) {
        await playlistService.update(playlist?.id, data);
      }
    },
    onSuccess: () => {
      toastSuccess("Reorder successfully");
    },
  });

  const handlePlay = (song: ISong) => {
    if (currentSong?.id === song?.id && isPlaying) {
      pause();
      return;
    }
    play(song);
  };

  const { data: liked } = useQuery({
    queryKey: ["playlist-like", playlist?.id],
    queryFn: async () => {
      if (!playlist) return;
      try {
        const res = await playlistService.checkLiked(playlist.id);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const mutationLiked = useMutation({
    mutationFn: async (like: boolean) => {
      try {
        if (!playlist) return;
        if (like) {
          await playlistService.unLikeSong(playlist.id);
        } else {
          await playlistService.likeSong(playlist.id);
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      if (playlist) {
        toastSuccess(liked ? "Remove from favorite" : "Add to favorite");
        queryClient.invalidateQueries({ queryKey: ["playlist", playlist.id] });
        queryClient.invalidateQueries({
          queryKey: ["playlist-like", playlist.id],
        });
        queryClient.invalidateQueries({ queryKey: ["playlist-favorites"] });
      }
    },
  });

  const handleClickOpenMenu = () => {
    if (menuPlaylist.open) {
      dispatch(closeMenu());
      return;
    }
    const rect = btnRef?.current?.getBoundingClientRect();
    if (rect) {
      dispatch(
        openMenu({
          open: true,
          playlist: playlist,
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        })
      );
    }
  };

  if (isLoading) return <Loading />;

  if (error || !slug) return notFound();

  return (
    <div className={`${styles.PlaylistPage}`}>
      <div className={`${styles.PlaylistPage_header}`}>
        {playlist && (
          <HeaderPage
            data={playlist}
            onEdit={
              playlist?.creator?.id === currentUser?.id
                ? () => setShowEdit(true)
                : undefined
            }
          />
        )}
      </div>
      <div className={`${styles.PlaylistPage_content}`}>
        <div className={`${styles.PlaylistPage_content_header}`}>
          <ButtonIconPrimary
            onClick={() => dataSong && playPlaylist(dataSong)}
            size="large"
            icon={<i className="fa-solid fa-play"></i>}
          />
          {currentUser?.id !== playlist?.creator?.id && (
            <ButtonIcon
              size="large"
              className={styles.btn_like}
              onClick={() => mutationLiked.mutate(liked || false)}
              icon={
                liked ? (
                  <i className="fa-solid fa-heart"></i>
                ) : (
                  <i className="fa-light fa-heart"></i>
                )
              }
            />
          )}
          <button
            className={`${styles.button_menu}`}
            ref={btnRef}
            onClick={handleClickOpenMenu}
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>

        <div className={`${styles.PlaylistPage_content_body}`}>
          {playlist && dataSong && dataSong.length > 0 ? (
            <Table
              onChange={(data) =>
                playlist &&
                playlist.creator?.id === currentUser?.id &&
                mutationUpdatePlaylist.mutate({
                  songIds: data.map((item) => item.id),
                })
              }
              data={dataSong}
              renderItem={(item, index) => (
                <Track
                  key={index}
                  song={item}
                  playlist={playlist}
                  onPlay={handlePlay}
                />
              )}
            />
          ) : (
            <Empty />
          )}
        </div>
      </div>
      <Modal show={showEdit} onClose={() => setShowEdit(false)}>
        {playlist && (
          <FormPlaylist
            open={showEdit}
            onClose={() => setShowEdit(false)}
            initialData={playlist}
            onSubmit={(data) => onSubmitEdit.mutate(data)}
          />
        )}
      </Modal>
    </div>
  );
};

export default PlaylistPage;
