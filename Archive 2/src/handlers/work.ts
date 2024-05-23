import { ipcMain } from "electron";
import { WorkService } from "../features/work/work.service";
import { Work } from "../models/work/Work";

ipcMain.handle("work-create", (event, workData) => {
  const workService = new WorkService();
  return workService.create(workData);
});

ipcMain.handle("work-findAll", (event) => {
  const workService = new WorkService();
  return workService.findAll();
});

ipcMain.handle("work-findOne", (event, id) => {
  const workService = new WorkService();
  return workService.findOne(id);
});

ipcMain.handle("work-update", (event, id: string, updatedWorkData: Work) => {
  const workService = new WorkService();
  return workService.update(id, updatedWorkData);
});

ipcMain.handle("work-delete", (event, id: string) => {
  const workService = new WorkService();
  return workService.delete(id);
});
