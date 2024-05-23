import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "works" })
export class Work {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;
}
