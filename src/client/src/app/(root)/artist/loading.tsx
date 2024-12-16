"use client";

import { CardArtist } from "@/components/Card";
import { LoadingTheme } from "@/components/common/Loading";
import { Section } from "@/components/Section";

const Loading = () => {
  return (
    <LoadingTheme>
      <Section>
        {Array.from({ length: 20 }).map((_, index) => (
          <CardArtist key={index} id={1} title={""} img="" isLoading={true} />
        ))}
      </Section>
    </LoadingTheme>
  );
};

export default Loading;
