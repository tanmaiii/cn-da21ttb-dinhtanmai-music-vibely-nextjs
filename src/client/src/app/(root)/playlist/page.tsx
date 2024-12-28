"use client";
import { Card } from "@/components/Card";
import Modal from "@/components/Modal";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/useToast";
import playlistService from "@/services/playlist.service";
import { IPlaylist, ISort, PlaylistRequestDto } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";
import LoadMore from "./LoadMore";
import { FormPlaylist } from "@/components/Form";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Popular", value: "mostLikes" },
  { id: 2, name: "Newest", value: "newest" },
  { id: 3, name: "Oldest", value: "oldest" },
];

const PlaylistPage = () => {
  const [active, setActive] = useState<ISort>("newest");
  const [nextPage, setNextPage] = useState(2);
  const [showAdd, setShowAdd] = useState(false);
  const { toastError, toastSuccess } = useCustomToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["playlist"] });
  }, [active, queryClient]);

  const { data, isLoading } = useQuery({
    queryKey: ["playlist", active],
    queryFn: async () => {
      const res = await playlistService.getAll({ page: 1, sort: active });
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
    <div className={`${styles.PlaylistPage}`}>
      <div className={`${styles.PlaylistPage_top}`}>
        <div className={styles.header}>
          <h1>Playlist</h1>
          <ButtonIcon
            onClick={() => setShowAdd(true)}
            dataTooltip="Create playlist"
            icon={<i className="fa-solid fa-plus"></i>}
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
      {isLoading ? (
        <Loading />
      ) : (
        <div className={`${styles.PlaylistPage_body} row no-gutters`}>
          <Section>
            {data &&
              data.map((item: IPlaylist, index: number) => (
                <Card index={index} key={index} data={item} />
              ))}
            <LoadMore
              setNextPage={setNextPage}
              params={{ sort: active, page: nextPage }}
            />
          </Section>
        </div>
      )}
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

export default PlaylistPage;
