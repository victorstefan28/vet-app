import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from "typeorm";
import { Appointment } from "./appointment";
import { Medication } from "../medication/Medication";
import { Work } from "../work/Work";
import { Lab } from "../lab/lab";

@Entity({ name: "records" })
export class Record {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.records)
  appointment: Appointment;

  @OneToMany(
    () => RecordMedication,
    (recordMedication) => recordMedication.record,
    { eager: true, cascade: ["insert", "update"] }
  )
  medications: RecordMedication[];

  @OneToMany(() => RecordWork, (recordWork) => recordWork.record, {
    eager: true,
    cascade: ["insert", "update"],
  })
  works: RecordWork[];

  @OneToMany(() => RecordLab, (recordLab) => recordLab.record, {
    eager: true,
    cascade: ["insert", "update"],
  })
  labs: RecordLab[];

  @Column("text", { nullable: true })
  title: string; // Optional field for title of the record

  @Column("text", { nullable: true })
  notes: string; // Optional field for additional notes

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "text", nullable: true })
  addedBy: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  totalPrice: number;
}

@Entity({ name: "record_medications" })
export class RecordMedication {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Record, (record) => record.medications)
  record: Record;

  @ManyToOne(() => Medication, { eager: true })
  medication: Medication;

  @Column({ type: "float" })
  quantity: number;
}

@Entity({ name: "record_works" })
export class RecordWork {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Record, (record) => record.works)
  record: Record;

  @ManyToOne(() => Work, { eager: true })
  work: Work;

  @Column({ type: "float" })
  quantity: number;
}

@Entity({ name: "record_labs" })
export class RecordLab {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Record, (record) => record.labs)
  record: Record;

  @ManyToOne(() => Lab, { eager: true })
  lab: Lab;

  @Column({ type: "float" })
  quantity: number;
}
