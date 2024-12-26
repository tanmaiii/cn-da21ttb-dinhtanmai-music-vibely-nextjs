"use client";

import { CardArtist } from "@/components/Card";
import { LoadingTheme } from "@/components/common/Loading";
import { Section } from "@/components/Section";
import { exArtist } from "@/lib/data";

const Loading = () => {
  return (
    <LoadingTheme>
      <Section>
        {Array.from({ length: 21 }).map((_, index) => (
          <CardArtist key={index} artist={exArtist} isLoading={true} />
        ))}
      </Section>
    </LoadingTheme>
  );
};

export default Loading;
