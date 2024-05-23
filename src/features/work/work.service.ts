import { Repository, getConnection, getRepository } from "typeorm";
import { Work } from "../../models/work/Work";

export class WorkService {
  constructor(private workRepository: Repository<Work> = getRepository(Work)) {}
  // Create a new Work
  async create(work: Work): Promise<Work> {
    await this.workRepository.save(work);
    return work;
  }

  // Read all Works
  async findAll(): Promise<Work[]> {
    return await this.workRepository.find();
  }

  // Read a Work by id
  async findOne(id: string): Promise<Work | undefined> {
    return await this.workRepository.findOneBy({ id });
  }

  // Update a Work by id
  async update(id: string, work: Work): Promise<Work | undefined> {
    await this.workRepository.update(id, work);
    return this.findOne(id);
  }

  // Delete a Work by id
  async delete(id: string): Promise<void> {
    await this.workRepository.delete(id);
  }
}
