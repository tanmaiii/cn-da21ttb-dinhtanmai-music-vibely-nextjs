import { Card } from "@/components/Card";
import { LoadingTheme } from "@/components/common/Loading";
import { SectionOneRow } from "@/components/Section";
import { exSong } from "@/lib/data";
import Skeleton from "react-loading-skeleton";

const loading = () => {
  return (
    <LoadingTheme>
      <Skeleton height={300} width={"100%"} />

      <SectionOneRow isLoading>
        {Array.from({ length: 20 }).map((_, index) => {
          return <Card isLoading={true} data={exSong} key={index} />;
        })}
      </SectionOneRow>

      <SectionOneRow isLoading>
        {Array.from({ length: 20 }).map((_, index) => {
          return <Card isLoading={true} data={exSong} key={index} />;
        })}
      </SectionOneRow>
    </LoadingTheme>
  );
};

export default loading;
