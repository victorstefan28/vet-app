import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Schedule } from "../clients/interfaces";
import { useProfile } from "src/react/providers/profile";

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showOnlyOwn, setShowOnlyOwn] = useState<boolean>(false);
  const profile = useProfile();

  useEffect(() => {
    if (selectedDate) {
      const fetchData = async () => {
        const result = await (window as any).electron.invoke("list-schedules");
        console.log(result, "PROFILE", profile);
        const filteredSchedules = result.filter((schedule: Schedule) =>
          dayjs(schedule.dateTime).isSame(selectedDate, "day")
        );
        setSchedules(filteredSchedules);
      };
      fetchData();
    }
  }, [selectedDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Calendar
        </Typography>
        <DateCalendar
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
        {/* <div style={{ display: "flex", flexDirection: "row" }}>
          <Switch
            checked={showOnlyOwn}
            onChange={() => setShowOnlyOwn(!showOnlyOwn)}
          />
          <Typography variant="body2">Arata doar programarile mele</Typography>
        </div> */}
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyOwn}
                onChange={() => setShowOnlyOwn(!showOnlyOwn)}
              />
            }
            label={
              <Typography variant="body2">
                Arata doar programarile mele
              </Typography>
            }
          />
        </FormGroup>
        <List>
          {schedules.map((schedule) => {
            if (
              showOnlyOwn &&
              schedule.addedBy?.id !== profile?.selectedProfile?.id
            )
              return null;
            return (
              <ListItem key={schedule.id}>
                <ListItemText
                  primary={
                    <>
                      {dayjs(schedule.dateTime).format("HH:mm")} /{" "}
                      {`${schedule.appointment?.ownerName} : ${schedule.appointment?.pet?.name} (${schedule.appointment?.pet.species})`}
                    </>
                  }
                  secondary={
                    <>
                      {schedule.notes +
                        "/ Programat de: " +
                        schedule.addedBy?.firstName ??
                        "" + " " + schedule.addedBy?.lastName ??
                        ""}{" "}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarPage;
