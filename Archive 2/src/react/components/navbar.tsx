import {
  ArrowBack,
  ArrowBackIos,
  ArrowForwardIos,
  ArrowLeft,
} from "@mui/icons-material";
import { AppBar, Button, Toolbar, Typography, useTheme } from "@mui/material";
import { LogoutButton } from "./logout";
import { useProfile } from "../providers/profile";

interface NavbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Navbar = ({ open, setOpen }: NavbarProps) => {
  const theme = useTheme();
  const auth = useProfile();
  return (
    <AppBar position="sticky" style={{ display: "flex" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Button
            sx={{
              marginLeft: `calc(${open ? 200 : 55}px)`,
              transition: theme.transitions.create(["margin-left"], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
              color: "white",
            }}
            onClick={() => history.back()}
          >
            <ArrowBackIos />
          </Button>
          <Button
            sx={{
              color: "white",
            }}
            onClick={() => history.forward()}
          >
            <ArrowForwardIos />
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" style={{ float: "right" }}>
            Vet Application
          </Typography>
          <sub>
            {auth.selectedProfile
              ? auth.selectedProfile?.firstName +
                " " +
                auth.selectedProfile?.lastName +
                " / " +
                auth.selectedProfile?.email
              : "Neautentificat"}
          </sub>
        </div>
        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
