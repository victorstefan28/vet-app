import { ProfileEntity } from "src/react/providers/profile";

export interface Pet {
  id: string;
  name: string;
  color?: string;
  species: string;
  birthDate?: Date;
  weight?: string;
  gender?: string;
}

export interface Schedule {
  id: string;
  dateTime: Date | string;
  notes: string;
  appointment: Partial<Appointment>;
  addedBy?: ProfileEntity;
}

export interface Appointment {
  id: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  pet: Pet;
  records: Record[];
  schedules: Schedule[];
}

export interface Record {
  id: string;
  totalPrice: number;
  medications: RecordMedication[];
  works: RecordWork[];
  labs: RecordLab[];
  title?: string;
  notes?: string;

  createdAt: Date;
}

export interface RecordMedication {
  id: string;
  medication: Medication;
  quantity: number;
}

export interface Medication {
  id: string;
  name: string;
  price: number;
}

export interface RecordWork {
  id: string;
  work: Work;
  quantity: number;
}

export interface Work {
  id: string;
  name: string;
  price: number;
}

export interface RecordLab {
  id: string;
  lab: Lab;
  quantity: number;
}

export interface Lab {
  id: string;
  name: string;
  price: number;
}
