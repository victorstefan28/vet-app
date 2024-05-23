import React, { useState, useEffect } from "react";
import { Button, TextField, Box } from "@mui/material";

interface MedicationFormProps {
  medication?: Medication;
  onSubmit: (medication: Medication) => void;
}

interface Medication {
  id?: number;
  name: string;
  measureUnit: string;
  price: number;
}

const MedicationForm: React.FC<MedicationFormProps> = ({
  medication,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Medication>({
    name: "",
    measureUnit: "",
    price: 0,
    ...medication,
  });

  useEffect(() => {
    if (medication) {
      setFormData(medication);
    }
  }, [medication]);

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
    if (!medication) {
      // Only reset form if it's not an edit
      setFormData({ name: "", measureUnit: "", price: 0 });
    }
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
        label="Denumire"
        variant="outlined"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Unitate de masura"
        variant="outlined"
        name="measureUnit"
        value={formData.measureUnit}
        onChange={handleChange}
        required
      />
      <TextField
        label="Pret per U.M."
        variant="outlined"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        {medication ? "Update" : "Submit"}
      </Button>
    </Box>
  );
};

export default MedicationForm;
