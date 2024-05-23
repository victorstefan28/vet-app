import { IsNull, Not, getConnection, getRepository } from "typeorm";
import { License } from "./license";
import * as bcrypt from "bcryptjs";

export class LicenseService {
  async validateLicenseKey(key: string): Promise<boolean> {
    const licenseRepository = getRepository(License);
    const count = await licenseRepository.count({ where: { licenseKey: key } });
    return count > 0;
  }

  async setPinForLicense(key: string, pin: string): Promise<boolean> {
    const licenseRepository = getRepository(License);
    const license = await licenseRepository.findOne({
      where: { licenseKey: key },
    });

    if (license && !license.pin) {
      const salt = await bcrypt.genSalt(10); // Adjust salt rounds as needed
      license.pin = await bcrypt.hash(pin, salt);

      await licenseRepository.save(license);
      return true;
    }
    return false;
  }

  async checkPin(key: string, pin: string): Promise<boolean> {
    const licenseRepository = getRepository(License);
    const license = await licenseRepository.findOne({
      where: { licenseKey: key },
    });
    if (license) {
      const match = await bcrypt.compare(pin, license.pin);
      return match;
    }
    return false;
  }

  async getLicensesWithPin(): Promise<License[]> {
    const licenseRepository = getRepository(License);
    return await licenseRepository.find({ where: { pin: Not(IsNull()) } });
  }
}
