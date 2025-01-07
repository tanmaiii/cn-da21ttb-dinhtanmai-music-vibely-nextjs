import genreService from "@/services/genre.service";
import { useQuery } from "@tanstack/react-query";
import { Dropdown } from "../Form";

interface Props {
  error?: string;
  value: string;
  handleChange: (value: string) => void;
}

const SelectGenre = ({ error, value, handleChange }: Props) => {

  const { data: genres } = useQuery({
    queryKey: ["genre"],
    queryFn: async () => {
      const res = await genreService.getAll({});
      return res.data.data;
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
