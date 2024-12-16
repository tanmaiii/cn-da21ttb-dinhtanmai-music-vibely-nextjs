import { Card } from "@/components/Card";
import { LoadingTheme } from "@/components/common/Loading";
import { SectionOneRow } from "@/components/Section";
import Skeleton from "react-loading-skeleton";

const loading = () => {
  return (
    <LoadingTheme>
      <Skeleton height={300} width={"100%"} />

      <SectionOneRow isLoading>
        {Array.from({ length: 20 }).map((_, index) => {
          return (
            <Card
              isLoading={true}
              key={index}
              title={`Title ${index + 1}`}
              desc={`Description ${index + 1}`}
              img=""
            />
          );
        })}
      </SectionOneRow>

      <SectionOneRow isLoading>
        {Array.from({ length: 20 }).map((_, index) => {
          return (
            <Card
              isLoading={true}
              key={index}
              title={`Title ${index + 1}`}
              desc={`Description ${index + 1}`}
              img=""
            />
          );
        })}
      </SectionOneRow>
    </LoadingTheme>
  );
};

export default loading;
