import { MockProxy, mock } from "jest-mock-extended";
import { LabService } from "../../features/lab/lab.service";
import { Lab } from "../../models/lab/lab";
import { Repository } from "typeorm";

describe("LabService", () => {
  let labService: LabService;
  let labRepositoryMock: MockProxy<Repository<Lab>>;

  beforeEach(() => {
    // Mock the Repository
    labRepositoryMock = mock<Repository<Lab>>();

    // Create a new instance of the LabService with the mocked repository
    labService = new LabService(labRepositoryMock);
  });

  describe("create", () => {
    it("should create a lab and return it", async () => {
      const newLab: Lab = {
        id: "1",
        name: "Lab A",
        price: 100.0,
      };

      labRepositoryMock.save.mockResolvedValueOnce(newLab); // Mock the save method to return the newLab

      const result = await labService.create(newLab);

      expect(result).toBe(newLab); // Verify that the result is the same as the newLab
      expect(labRepositoryMock.save).toHaveBeenCalledWith(newLab); // Verify that save method was called with newLab
    });
  });
  //Test for findAll method
  describe("findAll", () => {
    it("should retrieve all labs", async () => {
      const labs: Lab[] = [
        { id: "1", name: "Lab 1", price: 50 },
        { id: "2", name: "Lab 2", price: 80 },
      ];
      labRepositoryMock.find.mockResolvedValueOnce(labs); // Mock the find method to return all labs

      const result = await labService.findAll();

      expect(result).toHaveLength(2); // Verify that two labs are returned
      expect(result).toEqual(labs); // Verify that the result matches the mocked data
      expect(labRepositoryMock.find).toHaveBeenCalled(); // Verify that the find method was called.
    });
  });
  //Write tests for findOne, update, and delete methods.
  //Test for findOne method
  describe("findOne", () => {
    it("should retrieve a lab with a given id", async () => {
      const lab: Lab = { id: "1", name: "Lab X", price: 150 };
      labRepositoryMock.findOne.mockResolvedValueOnce(lab); // Mock the findOne method to return a single lab
      const result = await labService.findOne("1");

      expect(result).toBe(lab);
      expect(labRepositoryMock.findOne).toHaveBeenCalledWith("1");
    });
  });

  // Test for update method
  describe("update", () => {
    it("should update a lab and return the updated lab", async () => {
      const updatedLab: Lab = { id: "1", name: "Updated Lab", price: 200 };
      labRepositoryMock.findOne.mockResolvedValueOnce(updatedLab); // Mock the findOne to return the lab to be updated
      labRepositoryMock.update.mockResolvedValueOnce({
        generatedMaps: [],
        raw: [],
        affected: 1, // number of rows affected, for example
      }); // Mock the update method to return the updated lab

      const result = await labService.update("1", updatedLab);

      expect(result).toBe(updatedLab);
      expect(labRepositoryMock.findOne).toHaveBeenCalledWith("1"); // Verify that the findOne method was called with the correct id
      expect(labRepositoryMock.update).toHaveBeenCalledWith("1", updatedLab);
    });
  });
  // Test for delete method
  describe("delete", () => {
    it("should delete a lab with a given id", async () => {
      labRepositoryMock.delete.mockResolvedValue(undefined); // Mock the delete method to return void
      await labService.delete("1");

      expect(labRepositoryMock.delete).toHaveBeenCalledWith("1");
    });
  });
});
