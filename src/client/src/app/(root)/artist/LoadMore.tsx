"use client";

import { CardArtist } from "@/components/Card";
import loader from "@/public/images/spinner.svg";
import artistService from "@/services/artist.service";
import { IArtist } from "@/types";
import { QueryParams } from "@/types/common.type";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function LoadMore({
  params,
  setNextPage,
}: {
  params: QueryParams;
  setNextPage: (page: number) => void;
}) {
  const { ref, inView } = useInView();
  const [totalPages, setTotalPages] = useState(3);
  const [data, setData] = useState<IArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setData([]);
    setTotalPages(3);
  }, [params.sort, params.keyword, params.limit]);

  useEffect(() => {
    if (inView) {
      setIsLoading(true);
      const delay = 500;

      const timeoutId = setTimeout(async () => {
        const res = await artistService.getAll({ ...params });
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
      {data.map((item: IArtist, index: number) => (
        // <Card key={index} data={item} />
        <CardArtist key={index} index={index} artist={item} />
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
