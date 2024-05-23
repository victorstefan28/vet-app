import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import AppointmentForm from "./clientsForm";
import {
  Details,
  ReadMore,
  ReadMoreOutlined,
  Search,
  Share,
  TransitEnterexitSharp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
interface Pet {
  id: string;
  name: string;
  color: string;
  species: string;
}

interface Appointment {
  id: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  pet: Pet;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      const result = await (window as any).electron.invoke(
        "appointment-findAll"
      );
      setAppointments(result);
      setAllAppointments(result);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredAppointments = allAppointments.filter((appointment) =>
      appointment.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setAppointments(filteredAppointments);
  }, [searchQuery, allAppointments]);

  const handleCreateAppointment = async (newAppointment: Appointment) => {
    try {
      await (window as any).electron.invoke("appointment-create", {
        appointmentData: {
          ownerName: newAppointment.ownerName,
          ownerPhone: newAppointment.ownerPhone,
          ownerEmail: newAppointment.ownerEmail,
        },
        petData: {
          name: newAppointment.pet.name,
          species: newAppointment.pet.name,
        },
      });
      const updatedAppointments = await (window as any).electron.invoke(
        "appointment-findAll"
      );
      setAppointments(updatedAppointments);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" gutterBottom>
          Gestionare programări
        </Typography>
        <Button
          sx={{ marginBottom: "10px", maxWidth: "300px" }}
          variant="contained"
          onClick={() => setIsModalOpen(true)}
        >
          Adaugă programare
        </Button>
        <TextField
          placeholder="Search by owner name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300, marginBottom: 2 }}
        />

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table aria-label="appointments table">
            <TableHead>
              <TableRow sx={{ background: "#CCC" }}>
                <TableCell>Nume proprietar</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Nume animal</TableCell>
                <TableCell>Specie</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.ownerName}</TableCell>
                  <TableCell>{appointment.ownerPhone}</TableCell>
                  <TableCell>{appointment.ownerEmail}</TableCell>
                  <TableCell>{appointment.pet.name}</TableCell>
                  <TableCell>{appointment.pet.species}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        navigate("/client/" + appointment.id);
                      }}
                    >
                      {<ReadMoreOutlined />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <AppointmentForm onSubmit={handleCreateAppointment} />
        </Box>
      </Modal>
    </div>
  );
};

export default Appointments;
