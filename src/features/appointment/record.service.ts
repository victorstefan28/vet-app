import { Appointment } from "src/models/appointment/appointment";
import {
  Record,
  RecordLab,
  RecordMedication,
  RecordWork,
} from "src/models/appointment/record";
import { Lab } from "src/models/lab/lab";
import { Medication } from "src/models/medication/Medication";
import { Work } from "src/models/work/Work";
import { Repository, getRepository } from "typeorm";

export class RecordService {
  constructor(
    private recordRepository: Repository<Record> = getRepository(Record),
    private appointmentRepository: Repository<Appointment> = getRepository(
      Appointment
    )
  ) {}

  async createRecord(
    appointmentId: string,
    title?: string,
    notes?: string
  ): Promise<Record> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });
    const record = this.recordRepository.create({ appointment, title, notes });
    return this.recordRepository.save(record);
  }

  async getRecordById(id: string): Promise<Record | undefined> {
    return await this.recordRepository.findOne({
      where: { id: id },
      relations: ["medications", "works", "labs"],
    });
  }

  async updateRecord(
    id: string,
    updatedData: Partial<Record>
  ): Promise<Record | undefined> {
    await this.recordRepository.update(id, updatedData);
    return this.getRecordById(id);
  }

  async deleteRecord(id: string): Promise<void> {
    await this.recordRepository.delete(id);
  }

  private calculateTotalPrice(
    medications: RecordMedication[],
    works: RecordWork[],
    labs: RecordLab[]
  ): number {
    const medicationTotal = medications.reduce(
      (sum, med) => sum + med.medication.price * med.quantity,
      0
    );
    const workTotal = works.reduce(
      (sum, work) => sum + work.work.price * work.quantity,
      0
    );
    const labTotal = labs.reduce(
      (sum, lab) => sum + lab.lab.price * lab.quantity,
      0
    );
    return medicationTotal + workTotal + labTotal;
  }

  async addItemsToRecord(
    recordId: string,
    items: {
      medications?: RecordMedication[];
      works?: RecordWork[];
      labs?: RecordLab[];
    }
  ) {
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: ["medications", "works", "labs"],
    });

    if (record) {
      const allMedications = [
        ...(record.medications || []),
        ...(items.medications || []),
      ];
      const allWorks = [...(record.works || []), ...(items.works || [])];
      const allLabs = [...(record.labs || []), ...(items.labs || [])];

      record.totalPrice = this.calculateTotalPrice(
        allMedications,
        allWorks,
        allLabs
      ); // Calculate total price here
      Object.assign(record, {
        medications: allMedications,
        works: allWorks,
        labs: allLabs,
      });

      return this.recordRepository.save(record);
    }

    throw new Error("Record not found");
  }

  async removeItemFromRecord(
    recordId: string,
    itemType: "medications" | "works" | "labs",
    itemId: string
  ) {
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: [itemType],
    });

    if (record) {
      if (itemType === "medications") {
        record.medications = record.medications.filter(
          (item: RecordMedication) => item.id !== itemId
        );
      } else if (itemType === "works") {
        record.works = record.works.filter(
          (item: RecordWork) => item.id !== itemId
        );
      } else if (itemType === "labs") {
        record.labs = record.labs.filter(
          (item: RecordLab) => item.id !== itemId
        );
      }

      record.totalPrice = this.calculateTotalPrice(
        record.medications,
        record.works,
        record.labs
      ); // Calculate total price here
      return this.recordRepository.save(record);
    }

    throw new Error("Record not found");
  }
  async updateItemQuantity(
    recordId: string,
    itemType: "medications" | "works" | "labs",
    itemId: string,
    quantity: number
  ): Promise<Record | undefined> {
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: [itemType],
    });

    if (record) {
      if (itemType === "medications") {
        record.medications = record.medications.map((item: RecordMedication) =>
          item.id === itemId ? { ...item, quantity } : item
        );
      } else if (itemType === "works") {
        record.works = record.works.map((item: RecordWork) =>
          item.id === itemId ? { ...item, quantity } : item
        );
      } else if (itemType === "labs") {
        record.labs = record.labs.map((item: RecordLab) =>
          item.id === itemId ? { ...item, quantity } : item
        );
      }

      record.totalPrice = this.calculateTotalPrice(
        record.medications,
        record.works,
        record.labs
      );

      return this.recordRepository.save(record);
    }

    throw new Error("Record not found");
  }
}
