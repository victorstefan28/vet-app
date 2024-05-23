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
import { useProfile } from "src/react/providers/profile";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NoAuthPage() {
  const { selectedProfile, setSelectedProfile } = useProfile();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [enteredPin, setEnteredPin] = useState("");
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newProfile, setNewProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pin: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const fetchedProfiles = await (window as any).electron.invoke(
        "profile-findAll"
      );
      setProfiles(fetchedProfiles);
    })();
  }, []);

  const handleLogin = async () => {
    if (selectedProfileId) {
      const profile = await (window as any).electron.invoke(
        "profile-selectProfileByPin",
        profiles.find((p) => p.id === selectedProfileId)?.email,
        enteredPin
      );
      if (profile) {
        setSelectedProfile(profile);
        setOpenLoginModal(false);
        navigate("/");
        console.log("VALID PIN- TEST");
      } else {
        // Handle incorrect PIN (e.g., show error message)
        // console.log("INVALID PIN- TEST");
        toast.error("PIN invalid");
      }
    }
  };

  const handleCreateProfile = async () => {
    await (window as any).electron.invoke("profile-create", newProfile);
    setOpenCreateModal(false);
    // Refresh the list after creating
    const fetchedProfiles = await (window as any).electron.invoke(
      "profile-findAll"
    );
    setProfiles(fetchedProfiles);
  };

  return (
    <Container>
      <h2>Selecteaza un profil</h2>

      <Button onClick={() => setOpenCreateModal(true)}>
        Creeaza un nou profil
      </Button>

      <List>
        {profiles.map((profile) => (
          <ListItem
            key={profile.id}
            button
            onClick={() => {
              setSelectedProfileId(profile.id);
              setOpenLoginModal(true);
            }}
          >
            <ListItemText
              primary={`${profile.firstName} ${profile.lastName} (${profile.email}) `}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
        <DialogTitle>Introdu PIN-ul</DialogTitle>
        <DialogContent>
          <TextField
            label="PIN"
            type="password"
            fullWidth
            sx={{ marginTop: "10px" }}
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginModal(false)}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Creeaza profil</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            value={newProfile.firstName}
            onChange={(e) =>
              setNewProfile({ ...newProfile, firstName: e.target.value })
            }
          />
          <TextField
            label="Last Name"
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
            onChange={(e) =>
              setNewProfile({ ...newProfile, pin: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Anuleaza</Button>
          <Button onClick={handleCreateProfile}>Salveaza</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default NoAuthPage;
