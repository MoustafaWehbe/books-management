"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  useTheme,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <MenuBookIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            Book Management App
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          mt: "auto",
          backgroundColor: theme.palette.grey[100],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" color="text.secondary">
            © {new Date().getFullYear()} Book Management App
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
