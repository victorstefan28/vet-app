import { createConnection } from "typeorm";
import { User } from "./models/user/User";
import { License } from "./features/authenticate/license";
import { Medication } from "./models/medication/Medication";
import { Lab } from "./models/lab/lab";
import { Work } from "./models/work/Work";
import { Appointment } from "./models/appointment/appointment";
import { Pet } from "./models/appointment/pet";
import * as path from "path";
import { app } from "electron";
import * as fs from "fs";
import * as sqlite from "better-sqlite3";
import { Profile } from "./models/profile/profile";
import {
  Record,
  RecordLab,
  RecordMedication,
  RecordWork,
} from "./models/appointment/record";
import { Schedule } from "./models/appointment/schedule";

export const initializeDatabase = async () => {
  const isDev = !app.isPackaged;
  let dbPath;
  if (isDev) {
    // In development, place the database in the project root (or wherever is convenient)
    dbPath = path.join(app.getPath("userData"), "database_dev.sqlite"); // "/database_dev.sqlite";
  } else {
    // In production, use the 'userData' path provided by Electron
    dbPath = path.join(app.getPath("userData"), "database_prod.sqlite");
  }
  console.log(dbPath);
  try {
    const exists = await fs.existsSync(dbPath);
    if (!exists) {
      await fs.writeFile(dbPath, "", (err) => {});
    }
    const db = await new sqlite.default(dbPath, { fileMustExist: false });
    await db.close();
  } catch (err) {
    console.log("ERROR WHILE CREATING:", err);
  }
  try {
    await createConnection({
      type: "better-sqlite3",
      database: dbPath, // File will be created if it doesn't exist

      entities: [
        User,
        License,
        Medication,
        Lab,
        Work,
        Pet,
        Appointment,
        Profile,
        Record,
        RecordLab,
        RecordMedication,
        RecordWork,
        Schedule,
      ],
      synchronize: true, // Only for development, automatically creates tables
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection error: ", error);
  }
};
