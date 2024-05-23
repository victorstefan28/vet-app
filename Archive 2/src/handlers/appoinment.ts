import { ipcMain } from "electron";
import { AppointmentService } from "src/features/appointment/appointment.service";
import { Appointment } from "src/models/appointment/appointment";

ipcMain.handle("appointment-findAll", async () => {
  const service = new AppointmentService();
  return await service.getAppointments();
});

ipcMain.handle("appointment-findById", async (event, args) => {
  const service = new AppointmentService();
  return await service.getAppointmentById(args.id);
});

ipcMain.handle("appointment-create", async (event, args) => {
  const service = new AppointmentService();
  return await service.createAppointment(args.petData, args.appointmentData);
});

ipcMain.handle(
  "appointment-update",
  async (event, id: string, appointmentData: Appointment) => {
    console.log("appointment-update", id, appointmentData);
    const appointmentService = new AppointmentService();
    try {
      const updatedAppointment = await appointmentService.updateAppointment(
        id,
        appointmentData
      );
      return { success: true, appointment: updatedAppointment };
    } catch (error) {
      console.error("Error updating appointment:", error);
      return { success: false, error: error.message };
    }
  }
);

// Add additional handlers for update and delete as needed
