import { IPlaylist, ISong } from "@/types";
import { StaticImageData } from "next/image";
import apiConfig from "./api";

//Hàm này nhận vào một chuỗi và trả về chuỗi đã được chuẩn hóa
export const formatDateTime = (dateString: Date) => {
  const day = String(dateString.getDate()).padStart(2, "0");
  const month = String(dateString.getMonth() + 1).padStart(2, "0");
  const year = dateString.getFullYear();
  const hours = String(dateString.getHours()).padStart(2, "0");
  const minutes = String(dateString.getMinutes()).padStart(2, "0");

  return {
    dateTime: `${day}/${month}/${year}` + " " + `${hours}:${minutes}`,
    dateOnly: `${day}/${month}/${year}`,
    timeOnly: `${hours}:${minutes}`,
  };
};

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    const formatted = (num / 1_000_000_000).toFixed(1);
    return `${parseFloat(formatted)}B`; // Billion
  } else if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(1);
    return `${parseFloat(formatted)}M`; // Million
  } else if (num >= 1_000) {
    const formatted = (num / 1_000).toFixed(1);
    return `${parseFloat(formatted)}K`; // Thousand
  }
  return num?.toString(); // Nếu nhỏ hơn 1000 thì giữ nguyên
}

//trả về chuỗi thời gian đã trôi qua
export const timeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const key in intervals) {
    const interval = intervals[key];
    const count = Math.floor(seconds / interval);

    if (count >= 1) {
      return `${count} ${key}${count > 1 ? "s" : ""}`;
    }
  }

  return "just now";
};

//Hàm này nhận vào một số và trả về chuỗi số đó có dạng 2 chữ số
export const padNumber = (num: number): string => {
  return num.toString().padStart(2, "0");
};

//Hàm này nhận vào một số và trả về chuỗi thời gian có dạng 00:00
export const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  // Đảm bảo cả phút và giây luôn có hai chữ số
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  if (formattedMinutes && formattedSeconds) {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  return "00:00";
};

// Hàm này nhận vào một chuỗi hoặc một đối tượng ảnh và trả về một chuỗi
export const formatImg = (img: string | StaticImageData) => {
  return typeof img === "object" && "src" in img ? img.src : img || "";
};

// Hiển thị full màn hình
export const toggleFullScreen = (element: HTMLElement) => {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message}`
      );
    });
  } else {
    document.exitFullscreen().catch((err) => {
      console.error(
        `Error attempting to disable full-screen mode: ${err.message}`
      );
    });
  }
};

export const fadeIn = ({
  direction,
  delay = 0.2,
}: {
  direction: "up" | "down" | "left" | "right";
  delay?: number;
}) => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0.4,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export function isSongData(data: ISong | IPlaylist): data is ISong {
  return (data as ISong)?.duration !== undefined;
}

//Chuyển đổi kích thước file từ byte sang các đơn vị khác như KB, MB, GB, TB
export function formatFileSize(size: number): string {
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let index = 0;

  // Lặp cho đến khi tìm được đơn vị phù hợp
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  // Trả về chuỗi với 2 chữ số thập phân
  return `${parseFloat(size.toFixed(2))} ${units[index]}`;
}

export function apiImage(path: string) {
  if (path.includes("https://lh3.googleusercontent.com")) {
    return path;
  }

  if(path.includes("http://") || path.includes("https://")) {
    return path;
  }

  return `${apiConfig.imageURL(path)}`;
}

export const validateFile = (
  e: React.ChangeEvent<HTMLInputElement>,
  maxSize: number = 5 * 1024 * 1024, // 5MB
  validTypes: string[] = ["image/jpeg", "image/png", "image/gif"],
  required = true,
): { file: File | null; error: string | null; required?: boolean } => {
  const file = e.target.files ? e.target.files[0] : null;

  if (!required) {
    return { file, error: null };
  }

  if (!file) {
    return { file: null, error: "Please select an file." };
  }

  console.log(file.size, maxSize);
  

  if (file.size > maxSize) {
    return {
      file: null,
      error: `File size must be less than ${formatFileSize(maxSize)}`,
    };
  }

  if (validTypes.includes("lrc") && file.type !== "application/octet-stream") {
    if (file.name.split(".").pop()?.toLowerCase() !== "lrc") {
      return {
        file: null,
        error: "File extension must be .lrc",
      };
    }
    return { file, error: null };
  }

  if (!validTypes.includes(file.type)) {
    return {
      file: null,
      error: "Pass a valid file type: " + validTypes.join(", "),
    };
  }

  return { file, error: null };
};

export const hasPermission = (
  permissions: { name: string }[] = [],
  permission: string
) => permissions?.some(({ name }) => name === permission);

export const checkEmail = (value: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value);
}