import { useCallback, useEffect, useRef, useState } from "react";

//Hoook kiểm tra xem người dùng có hoạt động không
const useInactivity = (timeout: number = 5000) => {
  const [isInactive, setIsInactive] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    setIsInactive(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIsInactive(true);
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    window.addEventListener("mousemove", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [resetTimer, timer]);

  return isInactive;
};

export default useInactivity;
