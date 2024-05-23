import { ipcMain } from "electron";
import { ProfileService } from "src/features/profile/profile.service";

ipcMain.handle("profile-create", async (_, profileData) => {
  const profileService = new ProfileService();
  return await profileService.createProfile(profileData);
});

ipcMain.handle("profile-findAll", async () => {
  const profileService = new ProfileService();
  return await profileService.findAllProfiles();
});

ipcMain.handle("profile-selectProfileByPin", async (_, email, pin) => {
  const profileService = new ProfileService();
  return await profileService.selectProfileByPin(email, pin);
});
