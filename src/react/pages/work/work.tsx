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

interface Work {
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

const WorkManager: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newWork, setNewWork] = useState<Work>({ name: "", price: 0 });
  const [editWork, setEditWork] = useState<Work | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewWork({ name: "", price: 0 });
  };

  const handleOpenEditModal = (work: Work) => {
    setEditModal(true);
    setEditWork({ ...work });
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setEditWork(null);
  };

  useEffect(() => {
    (window as any).electron.invoke("work-findAll").then((response: any) => {
      setWorks(response);
    });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (editWork) {
      setEditWork((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setNewWork((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCreateWork = async () => {
    const newUpdatedWork = await (window as any).electron.invoke(
      "work-create",
      newWork
    );
    setWorks([...works, newUpdatedWork]);
    setOpenModal(false);
  };

  const handleEditWork = async () => {
    await (window as any).electron.invoke(
      "work-update",
      editWork!.id,
      editWork
    );
    const updatedWorks = works.map((work) =>
      work.id === editWork!.id ? editWork : work
    );
    setWorks(updatedWorks);
    handleCloseEditModal();
  };

  const handleDeleteWork = async (id: string) => {
    await (window as any).electron.invoke("work-delete", { id });
    const updatedWorks = works.filter((work) => work.id !== id);
    setWorks(updatedWorks);
  };

  return (
    <div>
      <Container
        sx={{ display: "flex", flexDirection: "column", paddingTop: "20px" }}
      >
        <Typography variant="h1" gutterBottom>
          Gestionare servicii oferite
        </Typography>
        <Button
          sx={{ maxWidth: "300px", marginBottom: "10px" }}
          variant="contained"
          onClick={handleOpenModal}
        >
          Adauga Lucrare
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
          {works
            .filter((work) =>
              work.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((work, index) => (
              <ListItem key={index} sx={{ outline: "solid 1px" }}>
                <ListItemText
                  primary={work.name}
                  secondary={`Pret: ${work.price} RON`}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteWork(work.id!)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenEditModal(work)}
                >
                  <Edit />
                </IconButton>
              </ListItem>
            ))}
        </List>
      </Container>

      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ padding: "20px" }}>
          <Box sx={modalStyle}>
            <TextField
              label="Nume Lucrare"
              value={newWork.name}
              name="name"
              onChange={handleInputChange}
            />
            <TextField
              label="Pret Lucrare"
              value={newWork.price.toString()}
              name="price"
              type="number"
              onChange={handleInputChange}
            />
            <Button
              sx={{ marginTop: "10px" }}
              variant="contained"
              onClick={handleCreateWork}
            >
              Salveaza
            </Button>
          </Box>
        </div>
      </Modal>

      <Modal open={editModal} onClose={handleCloseEditModal}>
        <div style={{ padding: "20px" }}>
          <Box sx={modalStyle}>
            <TextField
              label="Nume"
              value={editWork?.name || ""}
              name="name"
              onChange={handleInputChange}
            />
            <TextField
              label="Pret"
              value={editWork?.price?.toString() || ""}
              name="price"
              type="number"
              onChange={handleInputChange}
            />
            <Button
              sx={{ marginTop: "10px" }}
              variant="contained"
              onClick={handleEditWork}
            >
              Salveaza
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default WorkManager;
