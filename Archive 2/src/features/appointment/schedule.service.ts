// services/ScheduleService.ts
import { Schedule } from "src/models/appointment/schedule";
import { Repository, getRepository } from "typeorm";

export class ScheduleService {
  constructor(
    private scheduleRepository: Repository<Schedule> = getRepository(Schedule)
  ) {}

  async create(
    scheduleData: Partial<Schedule> & { dateTime?: any }
  ): Promise<Schedule> {
    // Ensure dateTime is stored as ISO string
    if (scheduleData.dateTime instanceof Date) {
      scheduleData.dateTime = scheduleData.dateTime.toISOString();
    }
    const schedule = this.scheduleRepository.create(scheduleData);
    await this.scheduleRepository.save(schedule);
    return schedule;
  }

  async read(id: string): Promise<Schedule | undefined> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: id },
      relations: ["appointment"],
    });
    return schedule;
  }

  async update(
    id: string,
    updatedData: Partial<Schedule> & { dateTime?: any }
  ): Promise<Schedule | undefined> {
    // Ensure dateTime is stored as ISO string
    if (updatedData.dateTime instanceof Date) {
      updatedData.dateTime = updatedData.dateTime.toISOString();
    }
    await this.scheduleRepository.update(id, updatedData);
    const updatedSchedule = await this.scheduleRepository.findOneBy({ id });
    return updatedSchedule;
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.scheduleRepository.delete(id);
    return { message: "Schedule deleted successfully" };
  }

  async list(): Promise<Schedule[]> {
    const schedules = await this.scheduleRepository.find({
      relations: ["appointment", "addedBy"],
    });
    return schedules;
  }
}
