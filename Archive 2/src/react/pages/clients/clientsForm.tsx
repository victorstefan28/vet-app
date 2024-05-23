import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
        label="Owner Name"
        variant="outlined"
        name="ownerName"
        value={formData.ownerName}
        onChange={handleChange}
        required
      />
      <TextField
        label="Owner Phone"
        variant="outlined"
        name="ownerPhone"
        value={formData.ownerPhone}
        onChange={handleChange}
        required
      />
      <TextField
        label="Owner Email"
        variant="outlined"
        name="ownerEmail"
        value={formData.ownerEmail}
        onChange={handleChange}
        required
      />
      <TextField
        label="Pet Name"
        variant="outlined"
        name="petName"
        value={formData.pet.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Pet Species"
        variant="outlined"
        name="petSpecies"
        value={formData.pet.species}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default AppointmentForm;
