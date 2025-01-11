import { IGenre } from "@/types";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

interface GenreN extends IGenre {
  numberOfSongs: number;
}

const BarChart = ({ genre }: { genre: GenreN[] }) => {
  console.log(genre);

  const data = {
    labels: genre.filter((g) => g.numberOfSongs > 0).map((g) => g.title),
    datasets: [
      {
        label: "Number of songs",
        data: genre
          .filter((g) => g.numberOfSongs > 0)
          .map((g) => g.numberOfSongs), // số lượt nghe theo thể loại
        borderColor: "rgb(255, 99,55)",
        backgroundColor: "rgba(255, 99,55, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;
