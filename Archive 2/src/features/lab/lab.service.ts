import { Lab } from "../../models/lab/lab";
import { Repository, getRepository } from "typeorm";

export class LabService {
  constructor(private labRepository: Repository<Lab> = getRepository(Lab)) {}

  // Create a new lab
  async create(lab: Lab): Promise<Lab> {
    return this.labRepository.save(lab);
  }

  // Retrieve all labs
  async findAll(): Promise<Lab[]> {
    return this.labRepository.find();
  }

  // Retrieve a lab by id
  async findOne(id: string): Promise<Lab | undefined> {
    return this.labRepository.findOneBy({ id });
  }

  // Update a lab
  async update(id: string, lab: Lab): Promise<Lab> {
    await this.labRepository.update(id, lab);
    return this.findOne(id);
  }

  // Delete a lab by id
  async delete(id: string): Promise<void> {
    await this.labRepository.delete(id);
  }
}
