import moodService from "@/services/mood.service";
import { useQuery } from "@tanstack/react-query";
import { MultipleSelect } from "../Form";

interface Props {
  error: any;
  value: any;
  handleChange: (value: string[]) => void;
}

const SelectMood = ({ error, value, handleChange }: Props) => {
  const { data: moods } = useQuery({
    queryKey: ["mood"],
    queryFn: async () => {
      const res = await moodService.getAll();
      return res.data;
    },
  });

  return (
    <div className="w-100">
      {moods && (
        <MultipleSelect
          label="Mood"
          name="mood"
          error={error}
          options={moods.map((g) => {
            return { label: g.title, value: g.id };
          })}
          values={value}
          onChange={(e) => handleChange(e)}
        />
      )}
    </div>
  );
};

export default SelectMood;
