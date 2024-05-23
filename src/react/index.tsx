import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "../App";

import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
