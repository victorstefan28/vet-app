import { contextBridge, ipcMain } from "electron";
import { License } from "../features/authenticate/license";
import { getRepository } from "typeorm";
import { LicenseService } from "../features/authenticate/license.service";
import { session } from "electron";
import * as path from "path";
ipcMain.handle("update-license", async (event, licenseData) => {
  const licenseRepository = getRepository(License);
  const newLicense = licenseRepository.create(licenseData);
  console.log("create-license invoked: ", licenseData);
  return await licenseRepository.save(newLicense);
});

ipcMain.handle("validate-license-key", async (event, { key }) => {
  const licenseService = new LicenseService();

  return await licenseService.validateLicenseKey(key);
});

ipcMain.handle("get-licenses-with-pin", async () => {
  const licenseService = new LicenseService();
  return await licenseService.getLicensesWithPin();
});

ipcMain.handle(
  "save-license",
  async (event, licenseData: { key: string; pin: string }) => {
    try {
      console.log("GOT", licenseData);
      const licenseRepository = getRepository(License);
      const newLicense = licenseRepository.create({
        licenseKey: licenseData.key,
        pin: licenseData.pin,
      });
      await licenseRepository.save(newLicense);
      return "License saved successfully!";
    } catch (error) {
      console.error("Error saving license:", error);
      return "Error saving license. Check the logs";
    }
  }
);

ipcMain.handle("set-pin-for-license", async (event, { key, pin }) => {
  const licenseService = new LicenseService();
  console.log("set-pin-for-license GOT ", key, pin);
  return await licenseService.setPinForLicense(key, pin);
});

ipcMain.handle("check-pin", async (event, { key, pin }) => {
  const licenseService = new LicenseService();
  console.log("check-pin GOT ", key, pin);
  return await licenseService.checkPin(key, pin);
});

ipcMain.handle("set-login-state", (event, isLoggedIn) => {
  session.defaultSession.setPreloads([
    path.join(__dirname, "preload.ts"), // Your existing preload
  ]);
  (session.defaultSession as any).userState = { isLoggedIn };

  // ... existing code ...
});
