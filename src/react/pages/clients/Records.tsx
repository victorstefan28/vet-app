import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Appointment,
  Lab,
  Medication,
  Record,
  RecordLab,
  RecordMedication,
  RecordWork,
  Work,
} from "./interfaces";
import { Cancel, Delete, Edit, Remove } from "@mui/icons-material";

interface RecordComponentProps {
  appointmentId: string;
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
  overflow: "scroll",
  maxHeight: "80vh",
};

const RecordComponent: React.FC<RecordComponentProps> = ({ appointmentId }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const theme = useTheme();

  const [expanded, setExpanded] = useState<string | false>(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [addItemsModalOpen, setAddItemsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [toBeAdded, setToBeAdded] = useState({
    medications: [],
    works: [],
    labs: [],
  });

  const [newRecordTitle, setNewRecordTitle] = useState("");
  const [newRecordNotes, setNewRecordNotes] = useState("");

  // State to manage editable quantities
  const [editableQuantities, setEditableQuantities] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      const meds = await (window as any).electron.invoke("medication-findAll");
      setMedications(meds);
      const works = await (window as any).electron.invoke("work-findAll");
      setWorks(works);
      const labs = await (window as any).electron.invoke("lab-findAll");
      setLabs(labs);

      const appointmentData = await (window as any).electron.invoke(
        "appointment-findById",
        { id: appointmentId }
      );
      setAppointment(appointmentData);
      setRecords(appointmentData.records);
      console.log(appointmentData);
    };

    fetchInitialData();
  }, [appointmentId]);

  const handleCreateRecord = async () => {
    // Create a new record and fetch updated records
    const newRecord = await (window as any).electron.invoke("record:create", {
      appointmentId,
      title: newRecordTitle,
      notes: newRecordNotes,
    });
    setRecords([...records, newRecord]);
    setCreateModalOpen(false);
    setNewRecordTitle("");
    setNewRecordNotes("");
  };

  const handleRemoveItemFromRecord = async (
    recordId: string,
    itemType: "medications" | "works" | "labs",
    itemId: string
  ) => {
    await (window as any).electron.invoke("record:removeItem", {
      recordId,
      itemType,
      itemId,
    });

    // Update local state
    setRecords((prevRecords) =>
      prevRecords.map((record) => {
        if (record.id === recordId) {
          const updatedRecord = { ...record };
          if (itemType === "medications") {
            updatedRecord.medications = updatedRecord.medications.filter(
              (item: RecordMedication) => item.id !== itemId
            );
          } else if (itemType === "works") {
            updatedRecord.works = updatedRecord.works.filter(
              (item: RecordWork) => item.id !== itemId
            );
          } else if (itemType === "labs") {
            updatedRecord.labs = updatedRecord.labs.filter(
              (item: RecordLab) => item.id !== itemId
            );
          }
          updatedRecord.totalPrice = calculateTotalPrice(
            updatedRecord.medications,
            updatedRecord.works,
            updatedRecord.labs
          );
          return updatedRecord;
        }
        return record;
      })
    );
  };

  const calculateTotalPrice = (
    medications: RecordMedication[],
    works: RecordWork[],
    labs: RecordLab[]
  ): number => {
    const medicationTotal = medications.reduce(
      (sum, med) => sum + med.medication.price * med.quantity,
      0
    );
    const workTotal = works.reduce(
      (sum, work) => sum + work.work.price * work.quantity,
      0
    );
    const labTotal = labs.reduce(
      (sum, lab) => sum + lab.lab.price * lab.quantity,
      0
    );
    return medicationTotal + workTotal + labTotal;
  };

  const handleAddItem = async () => {
    if (!expanded) return;
    const recordId = expanded;

    const updatedRecord = await (window as any).electron.invoke(
      "record:addItems",
      recordId,
      toBeAdded
    );
    console.log(updatedRecord);
    setRecords(
      records.map((record) => (record.id === recordId ? updatedRecord : record))
    );
    setAddItemsModalOpen(false);
    setToBeAdded({ medications: [], works: [], labs: [] });
  };

  const handleQuantityChange = async (
    recordId: string,
    itemId: string,
    type: "medications" | "works" | "labs",
    value: string
  ) => {
    await (window as any).electron.invoke("record:updateItemQuantity", {
      recordId,
      itemId,
      type,
      quantity: parseFloat(value),
    });

    // Update local state
    setRecords((prevRecords) =>
      prevRecords.map((record) => {
        if (record.id === recordId) {
          const updatedRecord = { ...record };
          updatedRecord[type] = updatedRecord[type].map((item: any) => {
            if (item.id === itemId) {
              return { ...item, quantity: parseFloat(value) };
            }
            return item;
          });
          return updatedRecord;
        }
        return record;
      })
    );

    // Reset editable quantity
    setEditableQuantities((prev) => ({
      ...prev,
      [`${recordId}-${itemId}-${type}`]: false,
    }));

    const appointmentData = await (window as any).electron.invoke(
      "appointment-findById",
      { id: appointmentId }
    );
    setAppointment(appointmentData);
    setRecords(appointmentData.records);
  };

  const handleDeleteRecord = async (recordId: string) => {
    await (window as any).electron.invoke("record:delete", recordId);
    setRecords(records.filter((record) => record.id !== recordId));
  };

  const toggleEditableQuantity = (
    recordId: string,
    itemId: string,
    type: "medications" | "works" | "labs"
  ) => {
    setEditableQuantities((prev) => ({
      ...prev,
      [`${recordId}-${itemId}-${type}`]: !prev[`${recordId}-${itemId}-${type}`],
    }));
  };

  return (
    <div>
      <Button
        sx={{ marginTop: "15px", marginBottom: "25px" }}
        variant="contained"
        onClick={() => setCreateModalOpen(true)}
      >
        Adauga observatie
      </Button>
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <Box sx={modalStyle}>
          <h2>Creeaza observatie noua</h2>
          <FormControl fullWidth>
            <TextField
              sx={{ marginBottom: "5px" }}
              label="Titlu"
              placeholder="Introdu titlul"
              value={newRecordTitle}
              onChange={(e) => setNewRecordTitle(e.target.value)}
            />
            <TextField
              label="Descriere"
              multiline
              rows={4}
              placeholder="Introdu descrierea observatiei"
              value={newRecordNotes}
              onChange={(e) => setNewRecordNotes(e.target.value)}
            />
          </FormControl>
          <Button onClick={handleCreateRecord}>Create</Button>
        </Box>
      </Modal>

      {records.map((record) => (
        <Accordion
          key={record.id}
          expanded={expanded === record.id}
          onChange={() =>
            setExpanded(expanded === record.id ? false : record.id)
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>
                Observatie {record.title} - Total:{" "}
                {record.totalPrice?.toFixed(2) ?? 0} RON
                <br />
                <sub>{record.createdAt.toLocaleString()}</sub>
              </Typography>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteRecord(record.id);
                }}
                sx={{ float: "right", padding: 0, margin: 0 }}
                size="small"
              >
                <Delete />
              </Button>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText
                  primary="Titlu"
                  secondary={<>{record.title || "No title"}</>}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Observatii"
                  secondary={<>{record.notes || "No notes"}</>}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Medicamente prescrise"
                  secondary={
                    record.medications && record.medications.length > 0 ? (
                      <List>
                        {record.medications.map(
                          (medication: RecordMedication) => (
                            <ListItem key={medication.id}>
                              {editableQuantities[
                                `${record.id}-${medication.id}-medications`
                              ] ? (
                                <TextField
                                  sx={{ marginLeft: "10px", width: "80px" }}
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  inputProps={{ step: "0.01" }}
                                  defaultValue={medication.quantity}
                                  onBlur={(e) =>
                                    handleQuantityChange(
                                      record.id,
                                      medication.id,
                                      "medications",
                                      parseFloat(e.target.value).toFixed(2) ??
                                        "0"
                                    )
                                  }
                                  autoFocus
                                />
                              ) : (
                                <Typography
                                  sx={{
                                    fontWeight: "700",
                                    color: theme.palette.primary.main,
                                  }}
                                  onClick={() =>
                                    toggleEditableQuantity(
                                      record.id,
                                      medication.id,
                                      "medications"
                                    )
                                  }
                                >
                                  {medication.quantity}
                                </Typography>
                              )}{" "}
                              x {medication.medication.name} ({" "}
                              <Typography sx={{ fontWeight: "700" }}>
                                {medication.medication.price}
                              </Typography>{" "}
                              RON ) ={" "}
                              <Typography
                                sx={{
                                  fontWeight: "700",
                                  color: theme.palette.error.light,
                                }}
                              >
                                {" "}
                                {(
                                  medication.quantity *
                                  medication.medication.price
                                ).toFixed(2)}{" "}
                              </Typography>{" "}
                              RON
                              <Button
                                onClick={(e) => {
                                  handleRemoveItemFromRecord(
                                    record.id,
                                    "medications",
                                    medication.id
                                  );
                                }}
                              >
                                <Delete />
                              </Button>
                            </ListItem>
                          )
                        )}
                      </List>
                    ) : (
                      "Nu au fost adaugate medicamente"
                    )
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Analize"
                  secondary={
                    record.labs && record.labs.length > 0 ? (
                      <List>
                        {record.labs.map((lab: RecordLab) => (
                          <ListItem key={lab.id}>
                            {editableQuantities[
                              `${record.id}-${lab.id}-labs`
                            ] ? (
                              <TextField
                                sx={{ marginLeft: "10px", width: "60px" }}
                                variant="outlined"
                                size="small"
                                type="number"
                                defaultValue={lab.quantity}
                                inputProps={{ step: "0.01" }}
                                onBlur={(e) =>
                                  handleQuantityChange(
                                    record.id,
                                    lab.id,
                                    "labs",
                                    parseFloat(e.target.value).toFixed(2)
                                  )
                                }
                                autoFocus
                              />
                            ) : (
                              <Typography
                                sx={{
                                  fontWeight: "700",
                                  color: theme.palette.primary.main,
                                }}
                                onClick={() =>
                                  toggleEditableQuantity(
                                    record.id,
                                    lab.id,
                                    "labs"
                                  )
                                }
                              >
                                {lab.quantity}
                              </Typography>
                            )}{" "}
                            x {lab.lab.name} ({" "}
                            <Typography sx={{ fontWeight: "700" }}>
                              {lab.lab.price}
                            </Typography>{" "}
                            RON ) ={" "}
                            <Typography
                              sx={{
                                fontWeight: "700",
                                color: theme.palette.error.light,
                              }}
                            >
                              {" "}
                              {(lab.quantity * lab.lab.price).toFixed(2) ??
                                0}{" "}
                            </Typography>{" "}
                            RON
                            <Button
                              onClick={(e) => {
                                handleRemoveItemFromRecord(
                                  record.id,
                                  "labs",
                                  lab.id
                                );
                              }}
                            >
                              <Delete />
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      "Nu au fost adaugate analize"
                    )
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Servicii"
                  secondary={
                    record.works && record.works.length > 0 ? (
                      <List>
                        {record.works.map((work: RecordWork) => (
                          <ListItem key={work.id}>
                            {(editableQuantities[
                              `${record.id}-${work.id}-works`
                            ] as any) ? (
                              <TextField
                                sx={{ marginLeft: "10px", width: "60px" }}
                                variant="outlined"
                                size="small"
                                type="number"
                                defaultValue={work.quantity}
                                onBlur={(e) =>
                                  handleQuantityChange(
                                    record.id,
                                    work.id,
                                    "works",
                                    e.target.value
                                  )
                                }
                                autoFocus
                              />
                            ) : (
                              <Typography
                                sx={{
                                  fontWeight: "700",
                                  color: theme.palette.primary.main,
                                }}
                                onClick={() =>
                                  toggleEditableQuantity(
                                    record.id,
                                    work.id,
                                    "works"
                                  )
                                }
                              >
                                {work.quantity}
                              </Typography>
                            )}{" "}
                            x {work.work.name} ({" "}
                            <Typography sx={{ fontWeight: "700" }}>
                              {work.work.price}
                            </Typography>{" "}
                            RON ) ={" "}
                            <Typography
                              sx={{
                                fontWeight: "700",
                                color: theme.palette.error.light,
                              }}
                            >
                              {" "}
                              {work.quantity * work.work.price}{" "}
                            </Typography>{" "}
                            RON
                            <Button
                              onClick={(e) => {
                                handleRemoveItemFromRecord(
                                  record.id,
                                  "works",
                                  work.id
                                );
                              }}
                            >
                              <Delete />
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      "Nu au fost adaugate servicii"
                    )
                  }
                />
              </ListItem>
            </List>

            <Button onClick={() => setAddItemsModalOpen(true)}>
              Adauga articole
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
      <Modal
        open={addItemsModalOpen}
        onClose={() => setAddItemsModalOpen(false)}
      >
        <Box sx={modalStyle}>
          <h2>Adauga articole</h2>
          <FormControl fullWidth>
            <InputLabel id="medication-select-label">Medicamente</InputLabel>
            <Select
              sx={{ marginBottom: "20px" }}
              labelId="medication-select-label"
              id="medication-select"
            >
              {medications.map((med) => {
                if (
                  toBeAdded.medications.some((medItem) => {
                    return medItem.medication.id === med.id;
                  })
                )
                  return null;
                return (
                  <MenuItem
                    onClick={() => {
                      if (toBeAdded.medications.includes(med)) return;
                      setToBeAdded({
                        ...toBeAdded,
                        medications: [
                          ...toBeAdded.medications,
                          { quantity: 1, medication: med },
                        ],
                      });
                    }}
                    key={med.id}
                    value={med.id}
                  >
                    {med.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="works-select-label">Servicii</InputLabel>
            <Select
              sx={{ marginBottom: "20px" }}
              labelId="works-select-label"
              id="works-select"
            >
              {works.map((work) => {
                if (
                  toBeAdded.works.some((workItem) => {
                    return workItem.work.id === work.id;
                  })
                )
                  return null;
                return (
                  <MenuItem
                    onClick={() => {
                      if (toBeAdded.works.includes(work)) return;
                      setToBeAdded({
                        ...toBeAdded,
                        works: [...toBeAdded.works, { quantity: 1, work }],
                      });
                    }}
                    key={work.id}
                    value={work.id}
                  >
                    {work.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="labs-select-label">Analize laborator</InputLabel>
            <Select labelId="labs-select-label" id="labs-select">
              {labs.map((lab) => {
                if (
                  toBeAdded.labs.some((labItem) => {
                    return labItem.lab.id === lab.id;
                  })
                )
                  return null;
                return (
                  <MenuItem
                    onClick={() => {
                      if (toBeAdded.labs.includes(lab)) return;
                      setToBeAdded({
                        ...toBeAdded,
                        labs: [...toBeAdded.labs, { quantity: 1, lab }],
                      });
                    }}
                    key={lab.id}
                    value={lab.id}
                  >
                    {lab.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography
            sx={{ marginLeft: "5px", marginTop: "10px" }}
            variant="body1"
          >
            Articole adaugate
          </Typography>
          <ul>
            {toBeAdded.medications.map((med: RecordMedication, index) => (
              <>
                <li key={med.medication.id}>
                  {med.medication.name}{" "}
                  <Button
                    size="small"
                    onClick={() => {
                      setToBeAdded((prev) => {
                        const newMeds = [...prev.medications];
                        newMeds.splice(index, 1);
                        return { ...prev, medications: newMeds };
                      });
                    }}
                    startIcon={<Cancel />}
                    color="error"
                    sx={{ margin: 0 }}
                  />
                </li>
                <TextField
                  sx={{ marginTop: "10px" }}
                  value={med.quantity}
                  variant="standard"
                  label={"Cantitate"}
                  size="medium"
                  type="number"
                  onChange={(e) =>
                    setToBeAdded((prev) => {
                      const newMedications = [...prev.medications];
                      newMedications[index].quantity = parseFloat(
                        e.target.value
                      );
                      return { ...prev, medications: newMedications };
                    })
                  }
                />
              </>
            ))}
            {toBeAdded.works.map((work: RecordWork, index) => (
              <>
                <li key={work.work.id}>{work.work.name}</li>
                <TextField
                  sx={{ marginTop: "10px" }}
                  value={work.quantity}
                  variant="standard"
                  label={"Cantitate"}
                  size="medium"
                  type="number"
                  onChange={(e) =>
                    setToBeAdded((prev) => {
                      const newWorks = [...prev.works];
                      newWorks[index].quantity = parseFloat(e.target.value);
                      return { ...prev, works: newWorks };
                    })
                  }
                />
              </>
            ))}
            {toBeAdded.labs.map((lab: RecordLab, index) => (
              <>
                <li key={lab.lab.id}>{lab.lab.name}</li>
                <TextField
                  sx={{ marginTop: "10px" }}
                  value={lab.quantity}
                  variant="standard"
                  label={"Cantitate"}
                  size="medium"
                  type="number"
                  onChange={(e) =>
                    setToBeAdded((prev) => {
                      const newLabs = [...prev.labs];
                      newLabs[index].quantity = parseFloat(e.target.value);
                      return { ...prev, labs: newLabs };
                    })
                  }
                />
              </>
            ))}
          </ul>
          <Button onClick={handleAddItem}>Adauga</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default RecordComponent;
