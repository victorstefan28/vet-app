import { ipcMain } from "electron";
import { ScheduleService } from "src/features/appointment/schedule.service";
import { Schedule } from "src/models/appointment/schedule";

ipcMain.handle(
  "create-schedule",
  async (event, scheduleData: Partial<Schedule>) => {
    const scheduleService = new ScheduleService();
    console.log(scheduleData, "scheduleData");
    return await scheduleService.create(scheduleData);
  }
);

ipcMain.handle("read-schedule", async (event, id: string) => {
  const scheduleService = new ScheduleService();
  return await scheduleService.read(id);
});

ipcMain.handle(
  "update-schedule",
  async (event, id: string, updatedData: Partial<Schedule>) => {
    const scheduleService = new ScheduleService();
    return await scheduleService.update(id, updatedData);
  }
);

ipcMain.handle("delete-schedule", async (event, id: string) => {
  const scheduleService = new ScheduleService();
  return await scheduleService.delete(id);
});

ipcMain.handle("list-schedules", async () => {
  const scheduleService = new ScheduleService();
  return await scheduleService.list();
});

ipcMain.handle(
  "schedule-findAllForToday",
  async (event, { date, profileId }) => {
    const scheduleService = new ScheduleService();
    return await scheduleService.findAllForToday(date, profileId);
  }
);
