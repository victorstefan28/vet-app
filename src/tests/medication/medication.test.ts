import { MedicationService } from "../../features/medication/medication.service";
import { Medication } from "../../models/medication/Medication";
import { Repository } from "typeorm";
import { mock, MockProxy } from "jest-mock-extended";

describe("MedicationService", () => {
  let service: MedicationService;
  let mockRepo: MockProxy<Repository<Medication>>;

  beforeEach(() => {
    mockRepo = mock<Repository<Medication>>();
    service = new MedicationService(mockRepo);
  });

  describe("findAll", () => {
    it("should return an array of medications", async () => {
      const mockMedications: Medication[] = [
        { id: "1", name: "Aspirin" } as Medication,
      ];
      mockRepo.find.mockResolvedValue(mockMedications);
      const result = await service.findAll();
      expect(result).toEqual(mockMedications);
      expect(mockRepo.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });

  describe("findOne", () => {
    it("should return a single medication if it exists", async () => {
      const medication: Medication = { id: "1", name: "Aspirin" } as Medication;
      mockRepo.findOneBy.mockResolvedValue(medication);
      const result = await service.findOne("1");
      expect(result).toEqual(medication);
    });

    it("should throw an error if medication is not found", async () => {
      mockRepo.findOneBy.mockResolvedValue(undefined);
      await expect(service.findOne("999")).rejects.toThrow(
        "Medication with ID '999' not found"
      );
    });
  });

  describe("create", () => {
    it("should create a new medication", async () => {
      const newMedicationData = {
        name: "Ibuprofen",
        measureUnit: "buc",
        price: 1.0,
      };
      const newMedication = { id: "2", ...newMedicationData } as Medication;
      mockRepo.create.mockReturnValue(newMedication);
      mockRepo.save.mockResolvedValue(newMedication);
      const result = await service.create(newMedicationData);
      expect(result).toEqual(newMedication);
      expect(mockRepo.create).toHaveBeenCalledWith(newMedicationData);
      expect(mockRepo.save).toHaveBeenCalledWith(newMedication);
    });
  });

  describe("update", () => {
    it("should update an existing medication", async () => {
      const existingMedication = { id: "1", name: "Aspirin" } as Medication;
      const updateData = { name: "Tylenol" };
      const updatedMedication = { ...existingMedication, ...updateData };

      mockRepo.findOneBy.mockResolvedValue(existingMedication);
      mockRepo.update.mockResolvedValue(undefined);
      mockRepo.findOneBy.mockResolvedValue(updatedMedication);

      const result = await service.update("1", updateData);
      expect(result).toEqual(updatedMedication);
      expect(mockRepo.update).toHaveBeenCalledWith("1", updateData);
      expect(mockRepo.findOneBy).toHaveBeenNthCalledWith(2, { id: "1" });
    });
  });
});
