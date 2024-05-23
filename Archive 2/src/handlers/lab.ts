import { ipcMain } from "electron";
import { LabService } from "../features/lab/lab.service";
import { Lab } from "../models/lab/lab";

// ipcMain handlers for CRUD operations
ipcMain.handle("lab-create", (event, lab: Lab) => {
  const labService = new LabService();
  console.log(lab);
  return labService.create(lab);
});

ipcMain.handle("lab-findAll", (event) => {
  const labService = new LabService();
  return labService.findAll();
});

ipcMain.handle("lab-edit", (event, lab: Lab) => {
  const labService = new LabService();
  return labService.update(lab.id, lab);
});

ipcMain.handle("lab-delete", (event, id: any) => {
  const labService = new LabService();
  return labService.delete(id);
});
