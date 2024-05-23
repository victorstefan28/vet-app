// import { Repository } from "typeorm";
// import { Record } from "src/models/appointment/record";
// import { Appointment } from "src/models/appointment/appointment";
// import { mock, MockProxy } from "jest-mock-extended";
// import { RecordService } from "src/features/appointment/record.service";
// import { Medication } from "src/models/medication/Medication";
// import { Work } from "src/models/work/Work";
// import { Lab } from "src/models/lab/lab";

// describe("RecordService", () => {
//   let recordService: RecordService;
//   let recordRepositoryMock: MockProxy<Repository<Record>>;
//   let appointmentRepositoryMock: MockProxy<Repository<Appointment>>;

//   beforeEach(() => {
//     recordRepositoryMock = mock<Repository<Record>>();
//     appointmentRepositoryMock = mock<Repository<Appointment>>();
//     recordService = new RecordService(
//       recordRepositoryMock,
//       appointmentRepositoryMock
//     );
//   });

//   describe("createRecord", () => {
//     it("should create and save a new record linked to an appointment", async () => {
//       const appointmentId = "1";
//       const notes = "Test Notes";
//       const appointment = { id: appointmentId } as Appointment;
//       const createdRecord = { appointment, notes } as Record;

//       // Mock setup for appointment fetch and record creation
//       appointmentRepositoryMock.findOne.mockResolvedValue(appointment);
//       recordRepositoryMock.create.mockReturnValue(createdRecord);
//       recordRepositoryMock.save.mockResolvedValue(createdRecord);

//       const result = await recordService.createRecord(appointmentId, notes);

//       expect(appointmentRepositoryMock.findOne).toHaveBeenCalledWith({
//         where: { id: appointmentId },
//       });
//       expect(recordRepositoryMock.create).toHaveBeenCalledWith({
//         appointment,
//         notes,
//       });
//       expect(recordRepositoryMock.save).toHaveBeenCalledWith(createdRecord);
//       expect(result).toEqual(createdRecord);
//     });
//   });
// });

// describe("addItemsToRecord", () => {
//   let recordService: RecordService;
//   let recordRepositoryMock: MockProxy<Repository<Record>>;
//   let appointmentRepositoryMock: MockProxy<Repository<Appointment>>;

//   beforeEach(() => {
//     recordRepositoryMock = mock<Repository<Record>>();
//     appointmentRepositoryMock = mock<Repository<Appointment>>();
//     recordService = new RecordService(
//       recordRepositoryMock,
//       appointmentRepositoryMock
//     );
//   });
//   it("should add items and update the total price", async () => {
//     const recordId = "1";
//     const medications = [
//       { id: "m1", price: 10 },
//       { id: "m2", price: 15 },
//     ] as Medication[];
//     const works = [{ id: "w1", price: 20 }] as Work[];
//     const labs = [{ id: "l1", price: 25 }] as Lab[];

//     const record = {
//       id: recordId,
//       medications: [],
//       works: [],
//       labs: [],
//     } as Record;
//     const updatedRecord = {
//       ...record,
//       medications: medications,
//       works: works,
//       labs: labs,
//       totalPrice: 70,
//     } as Record;

//     recordRepositoryMock.findOne.mockResolvedValue(record);
//     recordRepositoryMock.save.mockResolvedValue(updatedRecord);

//     const result = await recordService.addItemsToRecord(recordId, {
//       medications: medications,
//       works: works,
//       labs: labs,
//     });

//     expect(recordRepositoryMock.findOne).toHaveBeenCalledWith({
//       where: { id: recordId },
//       relations: ["medications", "works", "labs"],
//     });
//     expect(recordRepositoryMock.save).toHaveBeenCalledWith(updatedRecord);
//     expect(result).toEqual(updatedRecord);
//   });
// });
