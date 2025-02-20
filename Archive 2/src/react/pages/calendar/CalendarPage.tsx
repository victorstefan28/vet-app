import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Schedule } from "../clients/interfaces";
import { useProfile } from "src/react/providers/profile";

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
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
        <List>
          {schedules.map((schedule) => (
            <ListItem key={schedule.id}>
              <ListItemText
                primary={
                  <>
                    {dayjs(schedule.dateTime).format("HH:mm")} /{" "}
                    {`${schedule.appointment?.ownerName} : ${schedule.appointment?.pet?.name} (${schedule.appointment?.pet.species})`}
                  </>
                }
                secondary={<>schedule.notes</>}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarPage;
