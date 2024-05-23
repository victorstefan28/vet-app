import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
  Container,
} from "@mui/material";

function Profiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newProfile, setNewProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pin: "",
  });

  useEffect(() => {
    (async () => {
      const fetchedProfiles = await (window as any).electron.invoke(
        "profile-findAll"
      );
      setProfiles(fetchedProfiles);
    })();
  }, []);

  const handleCreateProfile = async () => {
    await (window as any).electron.invoke("profile-create", newProfile);
    setOpenCreateModal(false);
    const fetchedProfiles = await (window as any).electron.invoke(
      "profile-findAll"
    );
    setProfiles(fetchedProfiles);
  };

  return (
    <Container>
      <h2>Profile medici</h2>

      <Button onClick={() => setOpenCreateModal(true)}>Creeaza profil</Button>

      <List>
        {profiles.map((profile) => (
          <ListItem key={profile.id}>
            <ListItemText
              primary={`${profile.firstName} ${profile.lastName}`}
              secondary={profile.email}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Creeaza profil nou</DialogTitle>
        <DialogContent>
          <TextField
            label="Prenume"
            fullWidth
            value={newProfile.firstName}
            onChange={(e) =>
              setNewProfile({ ...newProfile, firstName: e.target.value })
            }
          />
          <TextField
            label="Nume"
            fullWidth
            value={newProfile.lastName}
            onChange={(e) =>
              setNewProfile({ ...newProfile, lastName: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            value={newProfile.email}
            onChange={(e) =>
              setNewProfile({ ...newProfile, email: e.target.value })
            }
          />
          <TextField
            label="PIN"
            fullWidth
            value={newProfile.pin}
            required
            onChange={(e) =>
              setNewProfile({ ...newProfile, pin: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateProfile}>Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profiles;
