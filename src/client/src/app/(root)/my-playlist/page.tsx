"use client";
import { Card } from "@/components/Card";
import { FormPlaylist } from "@/components/Form";
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
import LoadMore from "./LoadMore";
import styles from "./style.module.scss";
import Empty from "@/components/common/Empty";

const DataSort: { id: number; name: string; value: string }[] = [
  { id: 1, name: "All", value: "false" },
  { id: 2, name: "My", value: "true" },
];

const MyPlaylistPage = () => {
  const [active, setActive] = useState<string>("false");
  const [nextPage, setNextPage] = useState(2);
  const [showAdd, setShowAdd] = useState(false);
  const { toastError, toastSuccess } = useCustomToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["my-playlist"] });
  }, [active, queryClient]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-playlist", active],
    queryFn: async () => {
      const res = await playlistService.getMe({ page: 1, my: active });
      setNextPage(2);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const mutationAdd = useMutation({
    mutationFn: async (data: PlaylistRequestDto) => {
      const res = await playlistService.create(data);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Create playlist success");
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["my-playlist"] });
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

  if (isLoading) <Loading />;

  return (
    <div className={`${styles.MyPlaylistPage}`}>
      <div className={`${styles.MyPlaylistPage_top}`}>
        <div className={styles.header}>
          <h1>My playlist</h1>
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
      <div className={`${styles.MyPlaylistPage_body} row no-gutters`}>
        {data && data?.length > 0 ? (
          <Section>
            {data.map((item: IPlaylist, index: number) => (
              <Card index={index} key={index} data={item} />
            ))}
            <LoadMore
              setNextPage={setNextPage}
              params={{ page: nextPage, my: active }}
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

export default MyPlaylistPage;
