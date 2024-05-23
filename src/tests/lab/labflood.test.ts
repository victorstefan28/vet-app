import { MockProxy, mock } from "jest-mock-extended";
import { LabService } from "../../features/lab/lab.service";
import { Lab } from "../../models/lab/lab";
import { Repository, createConnection, getRepository } from "typeorm";

import path from "path";
import { app } from "electron";
import * as sqlite from "better-sqlite3";
import * as fs from "fs";

export const initializeDatabaseDbMock = async () => {
  const isDev = true;
  let dbPath;
  if (isDev) {
    // In development, place the database in the project root (or wherever is convenient)
    dbPath = "./database_dev.sqlite"; // "/database_dev.sqlite";
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
      entities: [Lab],
      synchronize: true, // Only for development, automatically creates tables
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection error: ", error);
  }
};
describe("LabService", () => {
  let labService: LabService;
  let labRepositoryMock: Repository<Lab>;

  beforeEach(() => {
    // Mock the Repository
    initializeDatabaseDbMock();
    labRepositoryMock = getRepository(Lab);

    // Create a new instance of the LabService with the mocked repository
    labService = new LabService(labRepositoryMock);
  });

  describe("create", () => {
    /// create 1000 labs in the db
    it("should create a lab and return it", async () => {
      for (let i = 0; i < 1000; i++) {
        const newLab: Lab = {
          id: "1",
          name: "Lab A",
          price: 100.0,
        };

        const result = await labService.create(newLab);

        expect(result).toBe(newLab); // Verify that the result is the same as the newLab
        //  expect(labRepositoryMock.save).toHaveBeenCalledWith(newLab); // Verify that save method was called with newLab
      }
    });
  });
});
