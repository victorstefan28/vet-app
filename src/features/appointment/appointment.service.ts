import { Appointment } from "@/models/appointment/appointment";
import { Pet } from "../../models/appointment/pet";

import { EntityRepository, Repository, getRepository } from "typeorm";

export class AppointmentService {
  constructor(
    private appointmentRepository: Repository<Appointment> = getRepository(
      Appointment
    ),

    private petRepository: Repository<Pet> = getRepository(Pet)
  ) {}

  async createAppointment(
    petData: Partial<Pet>,
    appointmentData: Partial<Appointment>
  ): Promise<Appointment> {
    const newPet = this.petRepository.create(petData);
    appointmentData.pet = newPet;
    await this.petRepository.save(newPet);
    const newAppointment = this.appointmentRepository.create(appointmentData);
    return await this.appointmentRepository.save(newAppointment);
  }

  async getAppointments(): Promise<Appointment[]> {
    return await this.appointmentRepository.find({ relations: ["pet"] }); // Include pet data
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    return await this.appointmentRepository.findOneBy({ id });
  }

  async updateAppointment(
    id: string,
    appointmentData: Appointment
  ): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    if (!appointment) return null;

    this.appointmentRepository.merge(appointment, appointmentData);
    return await this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(id: string): Promise<void> {
    await this.appointmentRepository.delete(id);
  }
}
