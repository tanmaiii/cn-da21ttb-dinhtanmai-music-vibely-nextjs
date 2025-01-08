import React from "react";
import Skeleton from "react-loading-skeleton";
import { LoadingTheme } from "../common/Loading";

const LoadingTable = () => {
  return (
    <LoadingTheme>
      <div className="row pb-2" >
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
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="row pb-2" key={index} style={{ padding: "10px 0"}}>
          <div className="col pc-2-4">
            <Skeleton height={30} />
            <Skeleton height={16} width={"60%"} />
          </div>
          <div className="col pc-2-4">
            <Skeleton height={30} />
            <Skeleton height={16} width={"60%"} />
          </div>
          <div className="col pc-2-4">
            <Skeleton height={30} />
            <Skeleton height={16} width={"60%"} />
          </div>
          <div className="col pc-2-4">
            <Skeleton height={30} />
            <Skeleton height={16} width={"60%"} />
          </div>
          <div className="col pc-2-4">
            <Skeleton height={30} />
            <Skeleton height={16} width={"60%"} />
          </div>
        </div>
      ))}
    </LoadingTheme>
  );
};

export default LoadingTable;
