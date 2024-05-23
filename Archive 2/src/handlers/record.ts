// main.ts or your ipcMain setup file
import { app, ipcMain } from "electron";
import { RecordService } from "src/features/appointment/record.service";

ipcMain.handle(
  "record:create",
  async (_event, { appointmentId, title, notes }) => {
    const recordService = new RecordService();
    console.log(appointmentId, title, notes, "appointmentId, title, notes");
    return recordService.createRecord(appointmentId, title, notes);
  }
);

ipcMain.handle("record:get", async (_event, recordId) => {
  const recordService = new RecordService();
  return recordService.getRecordById(recordId);
});

ipcMain.handle("record:update", async (_event, recordId, updatedData) => {
  const recordService = new RecordService();
  return recordService.updateRecord(recordId, updatedData);
});

ipcMain.handle("record:delete", async (_event, recordId) => {
  const recordService = new RecordService();
  return recordService.deleteRecord(recordId);
});

ipcMain.handle("record:addItems", async (_event, recordId, items) => {
  console.log(recordId, items, "recordId, items");
  const recordService = new RecordService();
  return recordService.addItemsToRecord(recordId, items);
});

ipcMain.handle(
  "record:removeItem",
  async (_event, { recordId, itemType, itemId }) => {
    console.log(recordId, itemId, "recordId, items");
    const recordService = new RecordService();
    return recordService.removeItemFromRecord(recordId, itemType, itemId);
  }
);

ipcMain.handle(
  "record:updateItemQuantity",
  async (_event, { recordId, itemId, type, quantity }) => {
    console.log(recordId, itemId, type, quantity, "recordId, items");
    const recordService = new RecordService();
    return recordService.updateItemQuantity(recordId, type, itemId, quantity);
  }
);
