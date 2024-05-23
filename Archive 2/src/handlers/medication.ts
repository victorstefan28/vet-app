import { ipcMain } from "electron";
import { MedicationService } from "src/features/medication/medication.service";
import { Medication } from "src/models/medication/Medication";
import { Repository } from "typeorm";

ipcMain.handle("medication-findAll", async (event) => {
  const medService = new MedicationService();

  return await medService.findAllNoPage();
});

ipcMain.handle("medication-findAllNoPaging", async (event, { id }) => {
  const medService = new MedicationService();

  return await medService.findOne(id);
});

ipcMain.handle("medication-create", async (event, { medicationData }) => {
  const medService = new MedicationService();
  console.log(medicationData, "server");
  return await medService.create(medicationData);
});
