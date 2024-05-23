import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment";
import { Profile } from "../profile/profile";

@Entity({ name: "schedules" })
export class Schedule {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.schedules, {
    cascade: true,
  })
  appointment: Appointment;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Profile, { cascade: true })
  @JoinColumn()
  addedBy: Profile;

  @Column({ type: "text" }) // Change to 'text' for SQLite compatibility
  dateTime: string; // Store date-time as ISO string

  @Column({ type: "text", nullable: true })
  notes: string;
}
