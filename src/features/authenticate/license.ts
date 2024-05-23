import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  licenseKey: string;

  @Column({ nullable: true }) // Initially, PIN is not set
  pin: string;
}
