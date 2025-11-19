// src/theme.js
import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
        }
      : {
          background: {
            default: "#121212",
            paper: "#1E1E1E",
          },
        }),
  },
  shape: {
    borderRadius: 12,
  },
});

