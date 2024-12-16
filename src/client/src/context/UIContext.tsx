"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Định nghĩa kiểu cho context
interface UIContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: "light" | "dark";
  toggleDarkMode: () => void;
  isWaitingOpen: boolean;
  toggleWaiting: () => void;
  isPlayingBar: boolean;
  togglePlayingBar: (bool?: boolean) => void;
  isLyricsOpen: boolean;
  toggleLyrics: () => void;
}

// Tạo context
const UIContext = createContext<UIContextType | undefined>(undefined);

// Tạo provider cho UIContext
export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isWaitingOpen, setIsWaitingOpen] = useState<boolean>(false);
  const [isPlayingBar, setIsPlayingBar] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || "light";

    const siderBar = localStorage.getItem("sidebar") === "true" || false;

    setIsSidebarOpen(siderBar);
    setTheme(savedTheme);

    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    console.log("toggleDarkMode", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    localStorage.setItem("sidebar", String(!isSidebarOpen));
  };

  const toggleWaiting = () => {
    setIsWaitingOpen((prev) => !prev);
  };

  const togglePlayingBar = (bool?: boolean) => {
    if (bool !== undefined) {
      setIsPlayingBar(bool);
    } else {
      setIsPlayingBar((prev) => !prev);
    }
  };

  const toggleLyrics = () => {
    setIsLyricsOpen((prev) => !prev);
  };

  return (
    <UIContext.Provider
      value={{
        isSidebarOpen,
        isWaitingOpen,
        isPlayingBar,
        isLyricsOpen,
        theme,
        toggleSidebar,
        toggleDarkMode,
        toggleWaiting,
        togglePlayingBar,
        toggleLyrics,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

// Custom hook để sử dụng UIContext
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
