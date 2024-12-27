import { Card } from "@/components/Card";
import { LoadingTheme } from "@/components/common/Loading";
import { Section } from "@/components/Section";
import { exSong } from "@/lib/data";

const loadingPage = () => {
  return (
    <LoadingTheme>
      <Section>
        {Array.from({ length: 20 }).map((_, index) => {
          return (
            <Card
              isLoading={true}
              data={exSong}
              key={index}
            />
          );
        })}
      </Section>
    </LoadingTheme>
  );
};

export default loadingPage;
