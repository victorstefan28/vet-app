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
} from "@mui/material";
import { useProfile } from "src/react/providers/profile";
import { useNavigate } from "react-router-dom";

function NoAuthPage() {
  const { selectedProfile, setSelectedProfile } = useProfile();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [enteredPin, setEnteredPin] = useState("");
  const [openLoginModal, setOpenLoginModal] = useState(false);
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
        console.log("INVALID PIN- TEST");
      }
    }
  };

  return (
    <div>
      <h2>Selecteaza un profil</h2>

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
        <DialogTitle>Enter PIN</DialogTitle>
        <DialogContent>
          <TextField
            label="PIN"
            type="password"
            fullWidth
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginModal(false)}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NoAuthPage;
