"use server";

import { Card } from "@/components/Card";
import { exArtist } from "./data";

const MAX_LIMIT = 16;

export interface ICard {
  id: string;
  name: string;
  image: {
    original: string;
  };
  kind: string;
  episodes: number;
  episodes_aired: number;
  score: string;
}

export async function fetchData(page: number) {
  const response = await fetch(
    `https://shikimori.one/api/animes?page=${page}&limit=${MAX_LIMIT}&order=popularity`
  );

  const data = await response.json();

  return data.map((item: ICard, index: number) => (
    <Card
      key={index}
      index={index}
      data={{
        id: item.id,
        title: item.name,
        slug: item.name,
        description: item.kind,
        imagePath: `https://shikimori.one/${item.image.original}`,
        creator: exArtist,
        owner: [
          {
            id: "123123",
            name: "Tấn Mãi",
            imagePath: "https://shikimori.one/avatars/original/123123.jpg",
            followers: 1000, // Add the missing followers property
          },
          {
            id: "123123",
            name: "Sơn Tùng M-TP",
            imagePath: "https://shikimori.one/avatars/original/123123.jpg",
            followers: 1000, // Add the missing followers property
          },
        ],
        createdAt: item.score,
        duration: item.score,
        public: true,
        number: item.episodes,
        listens: item.episodes_aired,
        likes: item.episodes,
        moods: [
          {
            id: "123123",
            title: "Happy",
            description: "Happy mood",
          },
          {
            id: "123124",
            title: "Sad",
            description: "Sad mood",
          },
        ], // Add the missing mood property
      }}
    />
  ));
}
