"use client";

import React from "react";
import { Alert, AlertTitle, Snackbar } from "@mui/material";

interface ErrorAlertProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  open,
  message,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
        <AlertTitle>Error</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};
