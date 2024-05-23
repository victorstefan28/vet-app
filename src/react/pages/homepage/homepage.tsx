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
  MedicalInformation,
  MedicalServices,
  Medication,
  People,
  Pets,
  Science,
  Settings,
} from "@mui/icons-material";
import { useProfile } from "src/react/providers/profile";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Schedule } from "../clients/interfaces";
import { format } from "date-fns";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  scheduleList: {
    margin: 20,
  },
  scheduleCard: {
    margin: 10,
    bgcolor: "background.paper",
    p: 4,
  },
  scheduleCardTitle: {
    fontWeight: "bold",
  },
  scheduleCardTime: {
    color: "gray",
  },
});

function HomePage() {
  const classes = useStyles();

  const { selectedProfile } = useProfile();
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response: Schedule[] = await (window as any).electron.invoke(
          "schedule-findAllForToday",
          { date: today, profileId: selectedProfile.id }
        );
        response.sort((a, b) => {
          return (
            new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
          );
        });
        setSchedules(response);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, [selectedProfile]);
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
            icon={<MedicalServices />}
          />
          <LinkCard
            to="/calendar"
            title="Calendar programari"
            description="Lista programarilor pacientilor"
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
            description="Gestioneaza profilele medicilor"
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
      <Paper className={classes.scheduleList}>
        <Typography variant="h5" gutterBottom align="center">
          Urmatoarele tale programari de astazi
        </Typography>
        <Typography variant="body2" gutterBottom align="center">
          {`(se afiseaza urmatoarele 3 programari)`}
        </Typography>
        <List>
          {schedules.length > 0 ? (
            schedules.map((schedule, index) => {
              if (index > 2) return;

              return (
                <Card key={schedule.id} className={classes.scheduleCard}>
                  <CardContent
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <Typography
                        variant="h6"
                        className={classes.scheduleCardTitle}
                      >
                        {schedule?.appointment?.ownerName}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={classes.scheduleCardTime}
                      >
                        Ora: {format(new Date(schedule.dateTime), "HH:mm")}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="h6"
                        className={classes.scheduleCardTitle}
                      >
                        Observatii
                      </Typography>
                      <Typography
                        variant="body2"
                        className={classes.scheduleCardTime}
                      >
                        {schedule?.notes}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="h6"
                        className={classes.scheduleCardTitle}
                      >
                        {schedule?.appointment?.pet?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={classes.scheduleCardTime}
                      >
                        {schedule?.appointment?.pet?.species}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Typography align="center" variant="body1">
              Nu aveti programari astazi.
            </Typography>
          )}
        </List>
      </Paper>
    </div>
  );
}

export default HomePage;
