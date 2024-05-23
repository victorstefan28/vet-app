import { ipcRenderer } from "electron/renderer";
import { initializeDatabase } from "../../database";
import { LicenseService } from "../../features/authenticate/license.service";
import { createConnection, getConnection } from "typeorm"; // For setting up test DB connection

describe("LicenseIpcRenderer", () => {
  beforeAll(async () => {});

  afterAll(async () => {});

  it("should hash and validate a PIN", async () => {
    const testLicenseKey = "TEST-KEY2";
    const testPin = "1234";

    const entity = await ipcRenderer.invoke("save-license", {
      key: testLicenseKey,
      pin: testPin,
    });

    expect(entity).toBeTruthy();
  });
});
