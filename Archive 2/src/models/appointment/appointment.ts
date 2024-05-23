import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Pet } from "./pet";
import { Record } from "./record";
import { Schedule } from "./schedule";

@Entity({ name: "appointments" })
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  ownerName: string;

  @Column()
  ownerPhone: string;

  @Column()
  ownerEmail: string;

  @OneToOne(() => Pet, (pet) => pet.appointment, {
    eager: true,
    nullable: true,
    cascade: ["insert", "update"],
  })
  @JoinColumn()
  pet: Pet;

  @OneToMany(() => Record, (record) => record.appointment, { eager: true })
  records: Record[];

  @OneToMany(() => Schedule, (schedule) => schedule.appointment, {
    eager: true,
    cascade: ["insert", "update"],
  })
  schedules: Schedule[];
}
