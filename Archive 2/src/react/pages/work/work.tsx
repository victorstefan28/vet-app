// Import necessary modules and components
import React, { useState } from "react";
import { useEffect } from "react";
import { ipcRenderer } from "electron";
import { Button, List, ListItem, ListItemText, Divider } from "@mui/material";

interface Work {
  id: string;
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
  // State to hold works
  const [works, setWorks] = useState<Work[]>([]);

  // State for individual work data during Create/Update operations
  const [workData, setWorkData] = useState<Work>({
    id: "",
    name: "",
    price: 0,
  });

  {
    /* 
    Fetch all works from the database and store them in the 'works' state when the component mounts.
    */
  }
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await (window as any).electron.invoke("work-findAll");
        setWorks(response);
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };

    fetchWorks();
  }, []);
  {
    /* 
    Handlers for different CRUD operations.
    */
  }
  const handleCreateWork = async () => {
    try {
      const newWork = await (window as any).electron.invoke(
        "work-create",
        workData
      );
      setWorks([...works, newWork]);
      setWorkData({ id: "", name: "", price: 0 });
    } catch (error) {
      console.error("Error creating work:", error);
    }
  };
  const handleUpdateWork = async () => {
    try {
      await (window as any).electron.invoke(
        "work-update",
        workData.id,
        workData
      );
      const updatedWorks = works.map((w) => {
        if (w.id === workData.id) return workData;
        return w;
      });

      setWorks(updatedWorks);
      setWorkData({ id: "", name: "", price: 0 });
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };
  const handleDeleteWork = async (id: string) => {
    try {
      await (window as any).electron.invoke("work-delete", id);
      const filteredWorks = works.filter((w) => w.id !== id);
      setWorks(filteredWorks);
    } catch (error) {
      console.error("Error deleting work:", error);
    }
  };
  return (
    <div>
      <List>
        {works.map((work) => (
          <ListItem key={work.id} divider>
            <ListItemText
              primary={work.name}
              secondary={`Price: ${work.price}`}
            />
            {/* Add a delete button for each work */}
            <Button
              variant="contained"
              onClick={() => handleDeleteWork(work.id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Form for Creating/Updating work */}
      <div>
        <text>Name:</text>
        <input
          type="text"
          value={workData.name}
          onChange={(e) => setWorkData({ ...workData, name: e.target.value })}
        />
        <text>Price:</text>
        <input
          type="text"
          value={workData.price}
          onChange={(e) =>
            setWorkData({ ...workData, price: parseFloat(e.target.value) })
          }
        />
        {/* Show different buttons based on if it's a create or update operation */}
        {workData.id === "" ? (
          <Button variant="contained" onClick={handleCreateWork}>
            Create
          </Button>
        ) : (
          <Button variant="contained" onClick={handleUpdateWork}>
            Update
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkManager;
