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
  IconButton,
} from "@mui/material";
import MedicationForm from "./MedicationForm";
import { Search, Edit, Delete } from "@mui/icons-material";

interface Medication {
  id: number; // Assuming an ID
  name: string;
  measureUnit: string;
  price: number;
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

const Medication: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allMedications, setAllMedications] = useState<Medication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      const result = await (window as any).electron.invoke(
        "medication-findAll",
        { page: 1 }
      );
      setMedications(result);
      setAllMedications(result);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredMedications = allMedications.filter((medication) =>
      medication.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setMedications(filteredMedications);
  }, [searchQuery, allMedications]);

  const handleCreateMedication = async (newMedication: Medication) => {
    try {
      await (window as any).electron.invoke("medication-create", {
        medicationData: newMedication,
      });
      // Assuming successful creation, refetch the medication list
      const updatedMedications = await (window as any).electron.invoke(
        "medication-findAll",
        { page: 1 }
      );
      setMedications(updatedMedications);
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      // Handle errors appropriately
      console.error(error);
    }
  };

  const handleEditMedication = async (updatedMedication: Medication) => {
    try {
      await (window as any).electron.invoke("medication-update", {
        id: updatedMedication.id,
        medicationData: updatedMedication,
      });
      // Assuming successful update, refetch the medication list
      const updatedMedications = await (window as any).electron.invoke(
        "medication-findAll",
        { page: 1 }
      );
      setMedications(updatedMedications);
      setIsEditModalOpen(false); // Close the modal
      setSelectedMedication(null);
    } catch (error) {
      // Handle errors appropriately
      console.error(error);
    }
  };

  const handleDeleteMedication = async (id: number) => {
    try {
      await (window as any).electron.invoke("medication-delete", { id });
      // Assuming successful deletion, refetch the medication list
      const updatedMedications = await (window as any).electron.invoke(
        "medication-findAll",
        { page: 1 }
      );
      setMedications(updatedMedications);
    } catch (error) {
      // Handle errors appropriately
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" gutterBottom>
          Gestionare medicamente
        </Typography>
        <Button
          sx={{ marginBottom: "10px", maxWidth: "300px" }}
          variant="contained"
          onClick={() => setIsModalOpen(true)}
        >
          Adauga medicament
        </Button>
        <TextField
          placeholder="Cauta dupa denumire"
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
          <Table aria-label="medications table">
            <TableHead>
              <TableRow sx={{ background: "#CCC" }}>
                <TableCell>Denumire</TableCell>
                <TableCell>Unitate de masura</TableCell>
                <TableCell>Pret per bucata</TableCell>
                <TableCell>Actiuni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell>{medication.name}</TableCell>
                  <TableCell>{medication.measureUnit}</TableCell>
                  <TableCell>{medication.price.toFixed(2)} RON</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedMedication(medication);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteMedication(medication.id)}
                    >
                      <Delete />
                    </IconButton>
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
          <MedicationForm onSubmit={handleCreateMedication} />
        </Box>
      </Modal>

      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          {selectedMedication && (
            <MedicationForm
              medication={selectedMedication}
              onSubmit={handleEditMedication}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Medication;
