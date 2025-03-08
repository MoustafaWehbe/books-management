"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#cc4022",
    },
    secondary: {
      main: "#cc4022",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
      <CssBaseline />
    </ThemeProvider>
  );
};

export default Providers;
