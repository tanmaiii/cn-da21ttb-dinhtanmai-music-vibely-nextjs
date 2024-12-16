import { useUI } from "@/context/UIContext";
import toast, { ToastOptions } from "react-hot-toast";

/// Hook tùy chỉnh toast (Thông báo)
export const useCustomToast = () => {
  const { theme } = useUI();

  const defaultOptions: ToastOptions = {
    style: {
      borderRadius: "10px",
      fontSize: "1rem",
      background: theme === "light" ? "#fff" : "#333",
      color: theme === "light" ? "#333" : "#fff",
      zIndex: "99999999 !important",
    },
  };

  const toastSuccess = (message: string, options: ToastOptions = {}) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const toastError = (message: string, options: ToastOptions = {}) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const toastInfo = (message: string, options: ToastOptions = {}) => {
    toast(message, {
      ...defaultOptions,
      ...options,
    });
  };

  return { toastSuccess, toastError, toastInfo };
};
