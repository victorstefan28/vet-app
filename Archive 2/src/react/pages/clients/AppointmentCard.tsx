import React, { useState } from "react";
import {
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  useTheme,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Appointment, Pet } from "./interfaces";

interface AppointmentProps {
  appointment: Appointment;
  setAppointment: (appointment: Appointment) => void;
}

function AppointmentDetails({ appointment, setAppointment }: AppointmentProps) {
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const theme = useTheme();
  const handleEditToggle = (field: string) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [pet, setPet] = useState<Pet>(appointment.pet);

  async function savePetChanges(field: string, label: string, newValue: any) {
    const petObject = { ...pet, [field]: newValue };
    if (field === "birthDate") {
      petObject[field] = new Date(newValue);
    }
    saveChanges("pet", label, petObject);
  }

  async function saveChanges(field: string, label: string, newValue: any) {
    try {
      const result = await (window as any).electron.invoke(
        "appointment-update",
        appointment.id,
        {
          ...appointment, // send the entire appointment
          [field]: newValue, // update the specific field that was edited
        }
      );

      if (result.success) {
        setAppointment(result.appointment); // Update the state with the new appointment data
        console.log("Appointment updated successfully:", result.appointment);
        setEditing((prev) => ({ ...prev, [label]: false })); // Close editing for the field
      } else {
        console.error("Error updating appointment:", result.error);
        // Handle the error in the UI (e.g., display an error message to the user)
      }
    } catch (error) {
      console.error("Error communicating with main process:", error);
      // Handle the IPC error in the UI
    }
  }
  console.log(appointment);
  return (
    <div
      style={{
        padding: "20px",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "8px",
        boxShadow: `0px 2px 4px ${theme.palette.grey[300]}`,
      }}
    >
      <Typography variant="h6">Date proprietar</Typography>

      {[
        { label: "Owner Name", value: appointment.ownerName, key: "Nume" },
        {
          label: "Telefon",
          value: appointment.ownerPhone,
          key: "ownerPhone",
        },
        {
          label: "Email",
          value: appointment.ownerEmail,
          key: "ownerEmail",
        },
      ].map(({ label, value, key }) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Typography
            style={{ width: "120px" }}
            color={editing[label] ? "primary" : "textPrimary"}
          >
            {label}:
          </Typography>
          <Collapse in={!editing[label]} timeout="auto" unmountOnExit>
            <Typography variant="body1">{value}</Typography>
          </Collapse>
          <Collapse in={editing[label]} timeout="auto" unmountOnExit>
            <TextField
              defaultValue={value}
              variant="outlined"
              size="small"
              fullWidth
              onBlur={(e) => saveChanges(key, label, e.target.value)} // Save on blur
            />
          </Collapse>
          <IconButton onClick={() => handleEditToggle(label)} size="small">
            <EditIcon color={editing[label] ? "secondary" : "action"} />
          </IconButton>
        </div>
      ))}

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Detalii pacient</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {[
            { label: "Pet Name", value: appointment.pet.name, key: "name" },
            {
              label: "Specie si rasaa",
              value: appointment.pet.species,
              key: "species",
            },
            {
              label: "Culoare",
              value: appointment.pet.color,
              key: "color",
            },
            {
              label: "Data nasterii",
              value: appointment.pet.birthDate?.toLocaleDateString(),
              key: "birthDate",
            },
          ].map(({ label, value, key }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                margin: "10px 0",
              }}
            >
              <Typography style={{ width: "120px" }}>{label}:</Typography>
              <Collapse in={!editing[label]} timeout="auto" unmountOnExit>
                <Typography variant="body1">{value}</Typography>
              </Collapse>
              <Collapse in={editing[label]} timeout="auto" unmountOnExit>
                <TextField
                  defaultValue={value}
                  variant="outlined"
                  size="small"
                  fullWidth
                  autoFocus
                  type={key == "birthDate" ? "date" : "text"}
                  onBlur={(e) => savePetChanges(key, label, e.target.value)} // Save on blur
                />
              </Collapse>
              <IconButton onClick={() => handleEditToggle(label)} size="small">
                <EditIcon color={editing[label] ? "secondary" : "action"} />
              </IconButton>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default AppointmentDetails;
