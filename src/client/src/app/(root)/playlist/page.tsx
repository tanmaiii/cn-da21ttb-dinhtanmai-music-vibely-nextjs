"use client";
import { Card } from "@/components/Card";
import LoadMorePlaylist from "@/components/LoadMore/LoadMorePlaylist";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui/Button";
import playlistService from "@/services/playlist.service";
import { IPlaylist, ISort } from "@/types";
import { useEffect, useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";
import Modal from "@/components/Modal";
import FormPlaylist from "@/components/FormPlaylist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IBodyCreatePlaylist } from "@/types/playlist.type";
import { useCustomToast } from "@/hooks/useToast";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Popular", value: "mostLikes" },
  { id: 2, name: "Newest", value: "newest" },
  { id: 3, name: "Oldest", value: "oldest" },
];

const PlaylistPage = () => {
  const [data, setData] = useState<IPlaylist[] | null>(null);
  const [isLoad, setIsLoad] = useState(true);
  const [active, setActive] = useState<ISort>("newest");
  const [nextPage, setNextPage] = useState(2);
  const [showAdd, setShowAdd] = useState(false);
  const { toastError, toastSuccess } = useCustomToast();
  const queryClient = useQueryClient();

  const featchData = async () => {
    setIsLoad(true);
    const res = await playlistService.getAll({ page: 1, sort: active });
    setData(res.data.data);
    setNextPage(2);
    setTimeout(() => {
      setIsLoad(false);
    }, 2000);
  };

  useEffect(() => {
    featchData();
  }, [active]);

  const {} = useQuery({
    queryKey: ["playlist"],
    queryFn: async () => {
      featchData();
    }
  })

  const mutationAdd = useMutation({
    mutationFn: async (data: IBodyCreatePlaylist) => {
      const res = await playlistService.create(data);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Create playlist success");
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
    onError: (error: any) => {
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
            setActive={(value: ISort) => setActive(value)}
          />
        </div>
      </div>
      {isLoad || !data ? (
        <Loading />
      ) : (
        <div className={`${styles.PlaylistPage_body} row no-gutters`}>
          <Section>
            {data.map((item: IPlaylist, index: number) => (
              <Card index={index} key={index} data={item} />
            ))}
            <LoadMorePlaylist
              setNextPage={setNextPage}
              params={{ sort: active, page: nextPage }}
            />
          </Section>
        </div>
      )}
      <Modal show={showAdd} onClose={() => setShowAdd(false)}>
        <FormPlaylist onSubmit={(data) => mutationAdd.mutate(data)} />
      </Modal>
    </div>
  );
};

export default PlaylistPage;
