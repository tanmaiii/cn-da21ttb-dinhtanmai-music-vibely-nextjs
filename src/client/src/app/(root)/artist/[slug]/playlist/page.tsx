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
import { IPlaylist, ISort, PlaylistRequestDto } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../style.module.scss";
import LoadMore from "./LoadMore";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Newest", value: "newest" },
  { id: 2, name: "Popular", value: "mostLikes" },
  { id: 3, name: "Oldest", value: "oldest" },
];

const ArtistPlaylistPage = () => {
  const [active, setActive] = useState<ISort>("newest");
  const [nextPage, setNextPage] = useState(2);
  const [showAdd, setShowAdd] = useState(false);
  const { toastError, toastSuccess } = useCustomToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || "");

  const { data: artist } = useQuery({
    queryKey: ["artist", slug],
    queryFn: async () => {
      const res = await artistService.getBySlug(slug);
      return res.data;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["artist-playlists-detail", active, artist],
    });
  }, [active, queryClient]);

  const { data, isLoading } = useQuery({
    queryKey: ["artist-playlists-detail", active, artist],
    queryFn: async () => {
      if (!artist) return;
      const res = await artistService.getPlaylists(artist?.id, {
        page: 1,
        limit: 5,
        sort: active,
      });
      setNextPage(2);
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

  return (
    <div className={`${styles.ArtistPlaylistPage}`}>
      <div className={`${styles.ArtistPlaylistPage_top}`}>
        <div className={styles.header}>
          <h1>{`${artist?.name} - Playlist`}</h1>
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
          <Section>
            {data.map((item: IPlaylist, index: number) => (
              <Card index={index} key={index} data={item} />
            ))}
            <LoadMore
              artist={artist}
              setNextPage={setNextPage}
              params={{ sort: active, page: nextPage, limit: 5 }}
            />
          </Section>
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

export default ArtistPlaylistPage;
