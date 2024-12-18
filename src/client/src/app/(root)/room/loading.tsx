"use client";

import { Card } from "@/components/Card";
import { LoadingTheme } from "@/components/common/Loading";
import { Section } from "@/components/Section";
import { exSong } from "@/lib/data";

const Loading = () => {
  return (
    <LoadingTheme>
      <Section>
        {Array.from({ length: 20 }).map((_, index) => (
          <Card key={index} data={exSong} />
        ))}
      </Section>
    </LoadingTheme>
  );
};

export default Loading;
