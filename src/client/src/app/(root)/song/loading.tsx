import CardSkeleton from "@/components/Card/CardSkeleton";
import { LoadingTheme } from "@/components/common/Loading";
import { Section } from "@/components/Section";

const loadingPage = () => {
  return (
    <LoadingTheme>
      <Section>
        {Array.from({ length: 20 }).map((_, index) => {
          return <CardSkeleton key={index} />;
        })}
      </Section>
    </LoadingTheme>
  );
};

export default loadingPage;
