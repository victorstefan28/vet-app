import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "profiles" }) // Force table name as 'profiles'
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  pin: string;

  // ... other relevant properties:
  // @Column()
  // address: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;
}
