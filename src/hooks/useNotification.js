// src/hooks/useNotification.js
import { useSnackbar } from "notistack";

const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notifySuccess = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 3000,
    });
  };

  const notifyError = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 4000,
    });
  };

  const notifyInfo = (message) => {
    enqueueSnackbar(message, {
      variant: "info",
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 3000,
    });
  };

  return { notifySuccess, notifyError, notifyInfo };
};

export default useNotification;
