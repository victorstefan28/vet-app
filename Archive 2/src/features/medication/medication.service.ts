import { Medication } from "../../models/medication/Medication";
import { Repository, getRepository } from "typeorm";

export class MedicationService {
  constructor(
    private medicationRepository: Repository<Medication> = getRepository(
      Medication
    )
  ) {}

  findAll(page: number = 1, limit: number = 10): Promise<Medication[]> {
    const offset = (page - 1) * limit;

    return this.medicationRepository.find({
      skip: offset,
      take: limit,
    });
  }

  findAllNoPage(): Promise<Medication[]> {
    return this.medicationRepository.find();
  }

  async findOne(id: string): Promise<Medication> {
    const medication = await this.medicationRepository.findOneBy({ id });
    if (!medication) {
      throw new Error(`Medication with ID '${id}' not found`);
    }
    return medication;
  }

  async create(medicationData: Omit<Medication, "id">): Promise<Medication> {
    const newMedication = this.medicationRepository.create(medicationData);
    return this.medicationRepository.save(newMedication);
  }

  async update(
    id: string,
    medicationData: Partial<Medication>
  ): Promise<Medication> {
    const medication = await this.findOne(id);
    await this.medicationRepository.update(id, medicationData);
    return this.findOne(id);
  }
}
