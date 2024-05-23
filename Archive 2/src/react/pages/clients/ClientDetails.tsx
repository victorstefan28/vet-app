import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  Grid,
  Card,
  TextField,
  Modal,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { ReadMoreOutlined } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { Appointment, Schedule } from "./interfaces";
import AppointmentDetails from "./AppointmentCard";
import RecordComponent from "./Records";
import { useProfile } from "src/react/providers/profile";

const ClientDetails: React.FC = () => {
  const search = useParams();
  console.log(search["id"]);
  const apptId = search["id"];
  const [appointment, setAppointment] = useState<Appointment>();
  const auth = useProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newScheduleDateTime, setNewScheduleDateTime] = useState<string>("");
  const [newScheduleNotes, setNewScheduleNotes] = useState<string>("");

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      const result = await (window as any).electron.invoke(
        "appointment-findById",
        { id: apptId }
      );
      setAppointment(result);
    };
    fetchData();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleScheduleCreate = async () => {
    if (!newScheduleDateTime) return;

    const newSchedule: Partial<Schedule> = {
      dateTime: new Date(newScheduleDateTime),
      notes: newScheduleNotes,
      appointment: appointment!,
      addedBy: auth?.selectedProfile,
    };

    const createdSchedule = await (window as any).electron.invoke(
      "create-schedule",
      newSchedule
    );

    if (createdSchedule) {
      setAppointment((prev) => ({
        ...prev!,
        schedules: [...(prev!.schedules || []), createdSchedule],
      }));
      handleCloseModal();
    }
  };

  if (!appointment) return <>Loading</>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
        <Typography variant="h4" gutterBottom>
          Detalii client
        </Typography>
        <Grid container spacing={3} sx={{ padding: 5 }}>
          <Grid xs={12} sm={6}>
            <AppointmentDetails
              appointment={appointment}
              setAppointment={setAppointment}
            />

            <RecordComponent appointmentId={apptId} />
          </Grid>
          <Grid item xs={6}>
            <Card>
              <Typography variant="h6">Programari</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
              >
                Adauga Programare
              </Button>
              <List>
                {appointment.schedules.map((schedule) => (
                  <ListItem key={schedule.dateTime.toString()}>
                    <ListItemText
                      primary={new Date(schedule.dateTime).toLocaleString()}
                      secondary={schedule.notes}
                    />
                  </ListItem>
                ))}
              </List>
              <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    backgroundColor: "white",
                    padding: "16px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h2 id="simple-modal-title">Adauga Programare</h2>
                  <TextField
                    label="Data si ora"
                    type="datetime-local"
                    fullWidth
                    value={newScheduleDateTime}
                    onChange={(e) => setNewScheduleDateTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    label="Note"
                    type="text"
                    fullWidth
                    value={newScheduleNotes}
                    onChange={(e) => setNewScheduleNotes(e.target.value)}
                    style={{ marginTop: "16px" }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleScheduleCreate}
                    style={{ marginTop: "16px" }}
                  >
                    Submit
                  </Button>
                </div>
              </Modal>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ClientDetails;
