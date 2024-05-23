import { BreakpointsOptions, createTheme } from "@mui/material/styles";

const vetClinicPalette = {
  primary: {
    main: "#009688", // Teal color for primary elements
  },
  secondary: {
    main: "#F57C00", // Orange color for secondary elements
  },
  success: {
    main: "#4CAF50", // Green for success states
  },
  error: {
    main: "#F44336", // Red for error states
  },
};
const typography = {
  fontFamily: ["Roboto", "sans-serif"].join(","),
  h1: {
    fontSize: "2rem",
    fontWeight: 600,
  },
  h2: {
    fontSize: "1.5rem",
    fontWeight: 500,
  },
  // ... other typography styles
};

const breakpoints: BreakpointsOptions = {
  values: {
    xs: 0, // Extra small screens
    sm: 600, // Small screens
    md: 900, // Medium screens
    lg: 1200, // Large screens
    xl: 1536, // Extra large screens
  },
};

export const theme = createTheme({
  palette: vetClinicPalette,
  typography,
  breakpoints,
});
