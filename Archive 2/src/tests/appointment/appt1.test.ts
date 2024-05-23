import { Appointment } from "../../models/appointment/appointment";
import { AppointmentService } from "../../features/appointment/appointment.service";
import { Repository, getConnection, getRepository } from "typeorm";
import { MockProxy, mock } from "jest-mock-extended";
import { initializeDatabase } from "../../database";
import { Pet } from "../../models/appointment/pet";

describe("AppointmentService", () => {
  let appointmentService: AppointmentService;
  let mockRepo: Repository<Appointment>;
  beforeAll(async () => {
    // Create a test database connection here
    await initializeDatabase();
  });

  beforeEach(async () => {
    appointmentService = new AppointmentService(mockRepo);
  });

  afterAll(async () => {
    // Clear database after each test
    await getRepository(Appointment).clear();
    await getRepository(Pet).clear();

    // Close the database connection
    await getConnection().close();
  });

  it("should create an appointment", async () => {
    const pet = new Pet();
    pet.name = "Fluffy";
    pet.color = "white";
    pet.species = "cat";
    pet.birthDate = new Date();

    const appointmentData: Partial<Appointment> = {
      ownerName: "John Doe",
      ownerPhone: "123-456-7890",
      ownerEmail: "john.doe@example.com",
      pet,
    };

    const newAppointment = await appointmentService.createAppointment(
      pet,
      appointmentData
    );
    console.log(newAppointment);
    expect(newAppointment.id).toBeDefined();
    expect(newAppointment.pet.id).toBeDefined();
  });

  // Add more tests for other CRUD operations...
});
