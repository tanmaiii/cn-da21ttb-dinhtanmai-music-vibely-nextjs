"use client";

import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import loader from "@/public/images/spinner.svg";

export type Card = JSX.Element;

interface LoadMoreProps {
  fetch: () => Card[];
}

function LoadMore({ fetch }: LoadMoreProps) {
  const { ref, inView } = useInView();

  const [data, setData] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inView) {
      setIsLoading(true);
      const delay = 500;

      const timeoutId = setTimeout(() => {
        const res = fetch();

        if (res) {
          setData([...data, ...res]);
        }

        setIsLoading(false);
      }, delay);

      // Xóa settimeout khi component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [inView, data, isLoading, fetch]);

  return (
    <>
      {data}
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
    </>
  );
}

export default LoadMore;
