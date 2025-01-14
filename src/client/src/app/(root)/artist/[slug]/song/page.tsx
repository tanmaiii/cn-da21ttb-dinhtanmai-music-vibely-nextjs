"use client";
import { Card } from "@/components/Card";
import { FormPlaylist } from "@/components/Form";
import Modal from "@/components/Modal";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import Empty from "@/components/common/Empty";
import { useCustomToast } from "@/hooks/useToast";
import artistService from "@/services/artist.service";
import playlistService from "@/services/playlist.service";
import { ISong, ISort, PlaylistRequestDto } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../style.module.scss";
import LoadMore from "./LoadMore";
import { ButtonIconPrimary } from "@/components/ui";
import { usePlayer } from "@/context/PlayerContext";
import TablePlaylist from "@/components/TablePlaylist";
import { Track } from "@/components/Track";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Newest", value: "newest" },
  { id: 2, name: "Most Likes", value: "mostLikes" },
  { id: 3, name: "Oldest", value: "oldest" },
  { id: 3, name: "Popular", value: "mostListens" },
];

const ArtistSongPage = () => {
  const [active, setActive] = useState<ISort>("newest");
  const [showAdd, setShowAdd] = useState(false);
  const { toastError, toastSuccess } = useCustomToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || "");
  const { playPlaylist } = usePlayer();
  const { currentSong, pause, play, isPlaying } = usePlayer();

  const { data: artist } = useQuery({
    queryKey: ["artist", slug],
    queryFn: async () => {
      const res = await artistService.getBySlug(slug);
      return res.data;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["artist-song-detail", active, artist],
    });
  }, [active, queryClient]);

  const { data } = useQuery({
    queryKey: ["artist-song-detail", active, artist],
    queryFn: async () => {
      if (!artist) return;
      const res = await artistService.getSongs(artist?.id, {
        page: 1,
        limit: 0,
        sort: active,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  const mutationAdd = useMutation({
    mutationFn: async (data: PlaylistRequestDto) => {
      const res = await playlistService.create(data);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Create playlist success");
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

  const handlePlayPlaylist = () => {
    if (data && data.length > 0) {
      playPlaylist(data);
    }
  };

  const handlePlay = (song: ISong) => {
    if (currentSong?.id === song?.id && isPlaying) {
      pause();
      return;
    }
    play(song);
  };

  return (
    <div className={`${styles.ArtistPlaylistPage}`}>
      <div className={`${styles.ArtistPlaylistPage_top}`}>
        <div className={styles.header}>
          <h1>{`${artist?.name} - Song`}</h1>
          <ButtonIconPrimary
            onClick={handlePlayPlaylist}
            size="medium"
            icon={<i className="fa-solid fa-play"></i>}
          />
        </div>
        <div className={styles.slider}>
          <SliderNav
            active={active}
            listNav={DataSort}
            setActive={(value: string) => setActive(value as ISort)}
          />
        </div>
      </div>
      <div className={`${styles.ArtistPlaylistPage_body} row no-gutters`}>
        {data && data?.length > 0 && artist ? (
          <TablePlaylist
            data={data}
            renderItem={(item, index) => (
              <Track key={index} song={item} onPlay={handlePlay} />
            )}
          />
        ) : (
          <Empty />
        )}
      </div>
      <Modal show={showAdd} onClose={() => setShowAdd(false)}>
        <FormPlaylist
          onClose={() => setShowAdd(false)}
          open={showAdd}
          onSubmit={(data) => mutationAdd.mutate(data)}
        />
      </Modal>
    </div>
  );
};

export default ArtistSongPage;
