import CardSkeleton from "@/components/Card/CardSkeleton";
import { LoadingTheme } from "@/components/common/Loading";
import { SectionOneRow } from "@/components/Section";
import Skeleton from "react-loading-skeleton";

const loading = () => {
  return (
    <LoadingTheme>
      <Skeleton height={300} width={"100%"} />

      <SectionOneRow isLoading>
        {Array.from({ length: 20 }).map((_, index) => {
          return <CardSkeleton  />;
        })}
      </SectionOneRow>

      <SectionOneRow isLoading>
        {Array.from({ length: 20 }).map((_, index) => {
          return <CardSkeleton  />;
        })}
      </SectionOneRow>
    </LoadingTheme>
  );
};

export default loading;
