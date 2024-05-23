import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "../App";

import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
