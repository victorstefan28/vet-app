import { initializeDatabase } from "../../database";
import { LicenseService } from "../../features/authenticate/license.service";
import { createConnection, getConnection } from "typeorm"; // For setting up test DB connection

describe("LicenseService", () => {
  let licenseService: LicenseService;

  beforeAll(async () => {
    await initializeDatabase();
    licenseService = new LicenseService();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it("should hash and validate a PIN", async () => {
    const testLicenseKey = "TEST-KEY";
    const testPin = "1234";

    const pinSet = await licenseService.setPinForLicense(
      testLicenseKey,
      testPin
    );
    expect(pinSet).toBeTruthy();

    const pinValid = await licenseService.checkPin(testLicenseKey, testPin);
    expect(pinValid).toBeTruthy();

    const pinInvalid = await licenseService.checkPin(
      testLicenseKey,
      "wrongPin"
    );
    expect(pinInvalid).toBeFalsy();
  });
});
