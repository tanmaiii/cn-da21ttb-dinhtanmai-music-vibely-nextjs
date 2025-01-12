"use client";

import { Card } from "@/components/Card";
import loader from "@/public/images/spinner.svg";
import playlistService from "@/services/playlist.service";
import { IPlaylist } from "@/types";
import { PlaylistLikeQueryParamsDto } from "@/types/playlist.type";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function LoadMore({
  params,
  setNextPage,
}: {
  params: PlaylistLikeQueryParamsDto;
  setNextPage: (page: number) => void;
}) {
  const { ref, inView } = useInView();
  const [totalPages, setTotalPages] = useState(3);
  const [data, setData] = useState<IPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setData([]);
    setTotalPages(3);
  }, [params.my, params.keyword, params.limit]);

  useEffect(() => {
    if (inView) {
      console.log("inView", inView);
      
      setIsLoading(true);
      const delay = 200;

      const timeoutId = setTimeout(async () => {
        const res = await playlistService.getMe({ ...params });
        console.log("res", res);
        
        setData([...data, ...res.data.data]);
        setTotalPages(res.data.totalPages);
        setNextPage(res.data.currentPage + 1);
        setIsLoading(false);
      }, delay);

      // Xóa settimeout khi component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [inView, data, isLoading, params, setNextPage]);

  return (
    <>
      {data.map((item: IPlaylist, index: number) => (
        <Card key={index} data={item} />
      ))}
      {(params.page ?? 2) <= totalPages && (
        <div
          ref={ref}
          style={{
            flexBasis: "100%",
            flexGrow: 1,
            justifyContent: "center",
            alignContent: "center",
            display: "flex",
          }}
        >
          {inView && isLoading && (
            <button style={{ margin: "0 auto" }}>
              <Image src={loader} alt="spinner" width={40} height={40} />
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default LoadMore;
