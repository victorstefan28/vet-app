import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { LinkCard } from "src/react/components/LinkCard";
import ExpandableSidebar from "src/react/components/Sidebar/ExpandableSidebar1";
import {
  CalendarToday,
  Email,
  Group,
  Handyman,
  Home,
  Medication,
  People,
  Pets,
  Science,
  Settings,
} from "@mui/icons-material";
import { useProfile } from "src/react/providers/profile";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    margin: 10,
  },
});

function HomePage() {
  const classes = useStyles();

  const { selectedProfile } = useProfile();
  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.content}>
        <Grid item xs={12} sm={6}>
          {/* <Button
            variant="contained"
            fullWidth
            onClick={() => {
              navigate("/medication");
            }}
          >
            Medication
          </Button> */}
          <LinkCard
            to="/medication"
            title="Medicamente"
            description="Lista medicamentelor"
            icon={<Medication />}
          />
          <LinkCard
            to="/work"
            title="Manopere"
            description="Gestioneaza lista de servicii"
            icon={<Handyman />}
          />
          <LinkCard
            to="/calendar"
            title="Calendar programari"
            description=""
            icon={<CalendarToday />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LinkCard
            to="/lab"
            title="Laborator"
            description="Gestioneaza laborator"
            icon={<Science />}
          />

          <LinkCard
            to="/clients"
            title="Pacienti"
            description="Gestioneaza pacienti"
            icon={<Pets />}
          />
          <LinkCard
            to="/profiles"
            title="Profile Medici"
            description="Gestioneaza pacienti"
            icon={<People />}
          />

          {/* <Button
            variant="contained"
            fullWidth
            onClick={() => {
              navigate("/lab");
            }}
          >
            Lab{" "}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              navigate("/work");
            }}
          >
            Manopere{" "}
          </Button> */}
        </Grid>
        {/* Add more buttons for other sections as needed */}
      </Grid>
    </div>
  );
}

export default HomePage;
