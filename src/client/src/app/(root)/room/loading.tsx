import CardSkeleton from "@/components/Card/CardSkeleton";
import { LoadingTheme } from "@/components/common/Loading";
import { Section } from "@/components/Section";

const Loading = () => {
  return (
    <LoadingTheme>
      <Section>
        {Array.from({ length: 21 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </Section>
    </LoadingTheme>
  );
};

export default Loading;
