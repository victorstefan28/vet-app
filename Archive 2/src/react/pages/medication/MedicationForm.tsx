import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

interface MedicationFormProps {
  onSubmit: (medication: Medication) => void;
}

interface Medication {
  id?: number;
  name: string;
  measureUnit: string;
  price: number;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Medication>({
    name: "",
    measureUnit: "",
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", measureUnit: "", price: 0 }); // Reset form after submission
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
        label="Name"
        variant="outlined"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Measure Unit"
        variant="outlined"
        name="measureUnit"
        value={formData.measureUnit}
        onChange={handleChange}
        required
      />
      <TextField
        label="Price"
        variant="outlined"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default MedicationForm;
