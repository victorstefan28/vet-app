import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Router,
  HashRouter,
  Navigate,
} from "react-router-dom";

import Medication from "./pages/medication/medication";
import LicenseSetup from "./components/LicenseKey";
import HomePage from "./pages/homepage/homepage";
import Lab from "./pages/lab/lab";
import WorkManager from "./pages/work/work";
import ExpandableSidebar from "./components/Sidebar/ExpandableSidebar1";
import { Home, People, Settings } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import Navbar from "./components/navbar";

import Appointments from "./pages/clients/clients";
import Profiles from "./pages/profiles/Profiles";
import NoAuthPage from "./pages/noauth/NoAuth";
import { useProfile } from "./providers/profile";
import ClientDetails from "./pages/clients/ClientDetails";
import CalendarPage from "./pages/calendar/CalendarPage";

const sidebarItem1 = {
  label: "Home",
  icon: <Home />,
  path: "/",
};

// Second SidebarItem object
const sidebarItem2 = {
  label: "Setari",
  icon: <Settings />,
  subItems: [
    {
      label: "Profile",
      icon: <People />,
      path: "/profiles",
    },
  ],
};

const AppRoutes = () => {
  const theme = useTheme();
  const { primary } = theme.palette;
  const [open, setOpen] = useState(false);
  const { selectedProfile } = useProfile();

  return (
    <HashRouter>
      <ExpandableSidebar
        items={[sidebarItem1, sidebarItem2]}
        width={200}
        open={open}
        setOpen={setOpen}
      />
      <Navbar open={open} setOpen={setOpen} />
      <div
        style={{
          transition: theme.transitions.create(["margin-left"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          marginLeft: `calc(${open ? 200 : 55}px)`,
          width: `calc(100vw-${open ? 200 : 55}px)`,
          height: "100vh",
        }}
      >
        <Routes>
          <Route path="/medication" element={<Medication />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/work" element={<WorkManager />} />
          <Route path="/clients" element={<Appointments />} />
          <Route path="/client/:id" element={<ClientDetails />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/login" element={<NoAuthPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route
            path="/"
            element={selectedProfile ? <HomePage /> : <Navigate to="/login" />}
          />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </HashRouter>
  );
};

export default AppRoutes;
