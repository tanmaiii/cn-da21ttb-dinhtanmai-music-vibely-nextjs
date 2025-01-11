import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Last 7 days",
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Number of listens and created songs",
      },
    },
  }
};

const labels = ["1", "2", "3", "4", "5", "6", "7"];
// const listensPerMonth = [1200, 1500, 1700, 1400, 2000, 2200, 1900]; // Số lượt nghe mỗi tháng

// const songsPlayedPerMonth = [300, 350, 400, 380, 420, 450, 410]; // Số bài hát được phát mỗ

const LineChart = ({
  listens,
  songs,
}: {
  listens: Record<string, number>;
  songs: Record<string, number>;
}) => {
  const listensPerDayArray = Object.entries(listens.data)
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime()
    )
    .map(([, value]) => value);

  const songsPerDayArray = Object.entries(songs.data)
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime()
    )
    .map(([, value]) => value);

  const data = {
    labels,
    datasets: [
      {
        label: "Listens",
        data: listensPerDayArray,
        borderColor: "rgb(255, 99,55)",
        backgroundColor: "rgba(255, 99,55, 0.5)",
      },
      {
        label: "Songs",
        data: songsPerDayArray,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
