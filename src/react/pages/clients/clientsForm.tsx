import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";

interface AppointmentFormProps {
  onSubmit: (appointment: Appointment) => void;
}

interface Pet {
  id?: string;
  name: string;
  color?: string;
  species: string;
}

interface Appointment {
  id?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  pet: Pet;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Appointment>({
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    pet: { name: "", species: "" },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name.startsWith("pet.")) {
      const petField = name.split(".")[1];
      console.log("PET PROBLEM", petField, value);
      setFormData((prevState) => ({
        ...prevState,
        pet: {
          ...prevState.pet,
          [petField]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      pet: { name: "", species: "" },
    });
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 2,
        "& .MuiTextField-root": { m: 1 },
        "& .MuiButton-root": { m: 1 },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Nume proprietar"
        variant="outlined"
        name="ownerName"
        value={formData.ownerName}
        onChange={handleChange}
        required
      />
      <TextField
        label="Telefon proprietar"
        variant="outlined"
        name="ownerPhone"
        value={formData.ownerPhone}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email proprietar"
        variant="outlined"
        name="ownerEmail"
        value={formData.ownerEmail}
        onChange={handleChange}
      />
      <TextField
        label="Nume pacient"
        variant="outlined"
        name="pet.name"
        value={formData.pet.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Specie pacient"
        variant="outlined"
        name="pet.species"
        value={formData.pet.species}
        onChange={handleChange}
      />
      <Typography align="center" variant="caption" color="textSecondary">
        {" "}
        Puteti adauga mai multe detalii ulterior in pagina dedicata clientului
      </Typography>
      <Button type="submit" variant="contained" color="primary">
        Adauga
      </Button>
    </Box>
  );
};

export default AppointmentForm;
