import { Drawer, useTheme } from "@mui/material";
import LicenseSetup from "./react/components/LicenseKey";
import HomePage from "./react/pages/homepage/homepage";
import AppRoutes from "./react/routes";
import ExpandableSidebar from "./react/components/Sidebar/ExpandableSidebar1";
import { Email, Group, Home, Settings } from "@mui/icons-material";
import { useState } from "react";
import { ProfileProvider } from "./react/providers/profile";

const App = () => {
  const isLoggedIn = (window as any).userState?.isLoggedIn;

  return (
    <>
      <ProfileProvider>
        <AppRoutes />
      </ProfileProvider>
    </>
  );
  const logat = console.log("app randat", isLoggedIn);
  return <div>{isLoggedIn ? <>Pula logata</> : <LicenseSetup />}</div>;
};
export default App;
