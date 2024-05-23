import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { Appointment } from "./appointment";

@Entity({ name: "pets" })
export class Pet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @Column()
  species: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  weight: string;

  @OneToOne(() => Appointment, (appointment) => appointment.pet, {
    nullable: true,
  })
  appointment: Appointment;
}
