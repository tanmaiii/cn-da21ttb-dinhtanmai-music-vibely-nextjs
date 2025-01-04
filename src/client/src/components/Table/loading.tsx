import React from "react";
import Skeleton from "react-loading-skeleton";
import { LoadingTheme } from "../common/Loading";

const LoadingTable = () => {
  return (
    <LoadingTheme>
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="row pb-2" key={index}>
          <div className="col pc-2-4">
            <Skeleton height={30} />
          </div>
          <div className="col pc-2-4">
            <Skeleton height={30} />
          </div>
          <div className="col pc-2-4">
            <Skeleton height={30} />
          </div>
          <div className="col pc-2-4">
            <Skeleton height={30} />
          </div>
          <div className="col pc-2-4">
            <Skeleton height={30} />
          </div>
        </div>
      ))}
    </LoadingTheme>
  );
};

export default LoadingTable;
