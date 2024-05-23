import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "medications" })
export class Medication {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string; // Name of the medication

  @Column({ type: "varchar" })
  measureUnit: string; // Unit of measurement (e.g., tablets, mg, ml)

  @Column()
  price: number; // Price of the medication (consider using a number type if storing actual prices)
}
