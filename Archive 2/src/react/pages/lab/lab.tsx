// Import necessary libraries
import React, { useEffect, useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  IconButton,
  Box,
  Typography,
  Container,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit, Search } from "@mui/icons-material";

// Define the Lab interface
interface Lab {
  id?: string;
  name: string;
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

const Lab: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newLab, setNewLab] = useState<Lab>({ name: "", price: 0 });
  const [editLab, setEditLab] = useState<Lab>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewLab({ id: "", name: "", price: 0 });
  };

  const handleOpenEditModal = (lab: Lab) => {
    setEditModal(true);
    setEditLab({ ...lab });
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setEditLab(null);
  };

  useEffect(() => {
    (window as any).electron.invoke("lab-findAll").then((response: any) => {
      setLabs(response);
    });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (editLab) {
      setEditLab((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setNewLab((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCreateLab = async () => {
    // Use the electron API to create a new lab
    const newUpdatedLab = await (window as any).electron.invoke(
      "lab-create",
      newLab
    );

    setLabs([...labs, newUpdatedLab]);
    setOpenModal(false);
  };
  const handleEditLab = () => {
    const updatedLabs = labs.map((lab) => {
      if (lab.id === editLab!.id) {
        return { ...lab, ...editLab };
      }
      return lab;
    });
    setLabs(updatedLabs);
    handleCloseEditModal();
  };

  const handleDeleteLab = (id: string) => {
    (window as any).electron.invoke("lab-delete", id);
    const updatedLabs = labs.filter((lab) => lab.id !== id);
    setLabs(updatedLabs);
  };

  return (
    <div>
      <Container
        sx={{ display: "flex", flexDirection: "column", paddingTop: "20px" }}
      >
        {/* Display the list of labs */}
        <Typography variant="h1" gutterBottom>
          Gestionare analize laborator
        </Typography>
        <Button
          sx={{ maxWidth: "300px", marginBottom: "10px" }}
          variant="contained"
          onClick={handleOpenModal}
        >
          Adauga analiza
        </Button>
        <TextField
          placeholder="Cauta"
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
        <List>
          {labs.map((lab, index) => (
            <ListItem key={index} sx={{ outline: "solid 1px" }}>
              <ListItemText
                primary={lab.name}
                secondary={`Pret: ${lab.price} RON`}
              />
              {/* Add the Delete button for each element */}
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteLab(lab.id)}
              >
                <DeleteIcon />
              </IconButton>
              {/* Add the Edit button for each element */}
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleOpenEditModal(lab)}
              >
                {/* You can use any suitable edit icon here */}
                {<Edit />}
              </IconButton>
            </ListItem>
          ))}
        </List>
        {/* Create button to open the modal */}
      </Container>

      {/* Modal to add a new lab */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ padding: "20px" }}>
          <Box sx={modalStyle}>
            <TextField
              label="Lab Name"
              value={newLab.name}
              name="name"
              onChange={handleInputChange}
            />
            <TextField
              label="Lab Price"
              value={newLab.price.toString()}
              name="price"
              type="number"
              onChange={handleInputChange}
            />
            <Button
              sx={{ marginTop: "10px" }}
              variant="contained"
              onClick={handleCreateLab}
            >
              Salveaza
            </Button>
          </Box>
        </div>
      </Modal>
      {/* Modal to edit a lab */}
      <Modal open={editModal} onClose={handleCloseEditModal}>
        <div style={{ padding: "20px" }}>
          <Box sx={modalStyle}>
            <TextField
              label="Denumire"
              value={editLab?.name || ""}
              name="name"
              onChange={handleInputChange}
            />
            <TextField
              label="Pret"
              value={editLab?.price?.toString() || ""}
              name="price"
              type="number"
              onChange={handleInputChange}
            />
            <Button
              sx={{ marginTop: "10px" }}
              variant="contained"
              onClick={handleEditLab}
            >
              Salveaza
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};
export default Lab;
