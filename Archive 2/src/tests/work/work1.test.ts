// Import necessary modules and libraries
import { Repository, UpdateResult } from "typeorm";

import { MockProxy, mock } from "jest-mock-extended";
import { Work } from "../../models/work/Work";
import { WorkService } from "../../features/work/work.service";

describe("WorkService", () => {
  let workService: WorkService;
  let mockWorkRepository: MockProxy<Repository<Work>>;

  beforeEach(() => {
    // Mock the Repository class using jest-mock-extended
    mockWorkRepository = mock<Repository<Work>>();

    // Create a new WorkService instance with the mocked repository
    workService = new WorkService(mockWorkRepository);
  });
  // Test for Create method
  test("should create a new Work", async () => {
    const newWork: Work = {
      id: "1",
      name: "Test Work",
      price: 100,
    };
    mockWorkRepository.save.mockResolvedValueOnce(newWork);

    const createdWork = await workService.create(newWork);
    expect(createdWork).toEqual(newWork);
    expect(mockWorkRepository.save).toHaveBeenCalledWith(newWork);
  });
  // Tests for other CRUD operations
  // Test for Read (FindAll) method
  test("should find all Works", async () => {
    const works = [
      { id: "1", name: "Work1", price: 50 },
      { id: "2", name: "Work2", price: 100 },
    ];
    mockWorkRepository.find.mockResolvedValueOnce(works);
    const result = await workService.findAll();
    expect(result).toEqual(works);
    expect(mockWorkRepository.find).toHaveBeenCalled();
  });
  // Add tests for findOne, update, and delete
  test("should find a Work by id", async () => {
    const work = { id: "1", name: "Work1", price: 150 };
    mockWorkRepository.findOneBy.mockResolvedValueOnce(work);

    const result = await workService.findOne("1");
    expect(result).toEqual(work);
    expect(mockWorkRepository.findOneBy).toHaveBeenCalledWith({ id: "1" });
  });

  test("should update a Work by id", async () => {
    const updatedWork = { id: "1", name: "Updated Work", price: 200 };
    mockWorkRepository.findOneBy.mockResolvedValueOnce(updatedWork); // Simulate existing work
    mockWorkRepository.update.mockResolvedValueOnce(new UpdateResult());

    await workService.update("1", updatedWork);
    expect(mockWorkRepository.update).toHaveBeenCalledWith("1", updatedWork);
    expect(mockWorkRepository.findOneBy).toHaveBeenCalledWith({ id: "1" });
  });
  test("should delete a Work by id", async () => {
    mockWorkRepository.delete.mockResolvedValueOnce(undefined);
    await workService.delete("1");
    expect(mockWorkRepository.delete).toHaveBeenCalledWith("1");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
