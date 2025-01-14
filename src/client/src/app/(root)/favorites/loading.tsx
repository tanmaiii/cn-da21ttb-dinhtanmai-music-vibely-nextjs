import { LoadingTheme } from "@/components/common/Loading";
import HeaderPageSkeleton from "@/components/HeaderPage/Skeleton";
import TrackSkeleton from "@/components/Track/Skeleton";
import Skeleton from "react-loading-skeleton";

const loading = () => {
  return (
    <LoadingTheme>
      <HeaderPageSkeleton />
      <div style={{ padding: "0 24px", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <Skeleton inline height={54} width={54} circle />
          <Skeleton inline height={54} width={54} circle />
        </div>
        <Skeleton height={60} width={"100%"} />
        <div className="row">
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <div key={index} className="col pc-12 t-12 m-12">
                <TrackSkeleton  />
              </div>
            );
          })}
        </div>
      </div>
    </LoadingTheme>
  );
};

export default loading;
