import React from "react";
import { Button } from "@mui/material";
import { useProfile } from "../providers/profile";

export const LogoutButton = () => {
  const { logout } = useProfile();
  return (
    <Button
      sx={{
        color: "white",
      }}
      onClick={logout}
    >
      Logout
    </Button>
  );
};
