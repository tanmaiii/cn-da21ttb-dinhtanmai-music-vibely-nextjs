import React from "react";
import { Dropdown } from "../Form";
import { useQuery } from "@tanstack/react-query";
import genreService from "@/services/genre.service";

interface Props {
  error: any;
  value: any;
  handleChange: (value: string) => void;
}

const SelectGenre = ({ error, value, handleChange }: Props) => {

  const { data: genres } = useQuery({
    queryKey: ["genre"],
    queryFn: async () => {
      const res = await genreService.getAll();
      return res.data;
    },
  });

  return (
    <div className="w-100">
      {genres && (
        <Dropdown
          label="Genre"
          name="genreId"
          error={error}
          value={value}
          options={genres.map((g) => {
            return { label: g.title, value: g.id };
          })}
          onChange={(e) => handleChange(e.value)}
        />
      )}
    </div>
  );
};

export default SelectGenre;
