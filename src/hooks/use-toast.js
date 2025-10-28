import { useState, useCallback } from "react";

let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default", ...props }) => {
    const id = (++toastCount).toString();
    const newToast = {
      id,
      title,
      description,
      variant,
      ...props,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 5000);

    return {
      id,
      dismiss: () => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      },
    };
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
}