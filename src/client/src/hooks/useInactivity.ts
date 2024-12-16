import { useEffect, useState } from "react";

//Hoook kiểm tra xem người dùng có hoạt động không
const useInactivity = (timeout: number = 5000) => {
  const [isInactive, setIsInactive] = useState(false);
  let timer: NodeJS.Timeout | null = null;

  const resetTimer = () => {
    setIsInactive(false);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      setIsInactive(true);
    }, timeout);
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return isInactive;
};

export default useInactivity;
