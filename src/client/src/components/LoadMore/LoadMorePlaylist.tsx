"use client";

import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import loader from "@/public/images/spinner.svg";
import playlistService from "@/services/playlist.service";
import { IPlaylist } from "@/types";
import { Card } from "../Card";


function LoadMorePlaylist() {
  const { ref, inView } = useInView();
  const [totalPages, setTotalPages] = useState(3);
  let page = 2;

  const [data, setData] = useState<IPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inView) {
      setIsLoading(true);
      const delay = 500;

      const timeoutId = setTimeout(async () => {
        const res = await playlistService.getAll({ page: page });
        setData(res.data.data);
        setTotalPages(res.data.totalPages);
        page++;
        setIsLoading(false);
      }, delay);

      // Xóa settimeout khi component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [inView, data, isLoading, fetch]);

  

  return (
    <>
      {data.map((item: IPlaylist, index: number) => (
        <Card key={index} data={item} />
      ))}
      {page < totalPages && (
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

export default LoadMorePlaylist;
