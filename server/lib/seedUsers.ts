import { hashPassword } from "./auth";
import { getUsersCollection } from "./db";

export interface SeedUser {
  email: string;
  password: string;
  name: string;
  country: string;
  phone: string;
  age: number;
}

export const SEED_USERS: SeedUser[] = [
  {
    email: "ana.garcia@example.com",
    password: "Ana#Pass2024",
    name: "Ana García",
    country: "España",
    phone: "+34 600 111 222",
    age: 29,
  },
  {
    email: "carlos.mendez@example.com",
    password: "Carlos#Pass2024",
    name: "Carlos Méndez",
    country: "México",
    phone: "+52 55 1234 5678",
    age: 34,
  },
  {
    email: "lucia.fernandez@example.com",
    password: "Lucia#Pass2024",
    name: "Lucía Fernández",
    country: "Argentina",
    phone: "+54 9 11 2345 6789",
    age: 26,
  },
  {
    email: "diego.rojas@example.com",
    password: "Diego#Pass2024",
    name: "Diego Rojas",
    country: "Colombia",
    phone: "+57 300 123 4567",
    age: 31,
  },
  {
    email: "maria.torres@example.com",
    password: "Maria#Pass2024",
    name: "María Torres",
    country: "Chile",
    phone: "+56 9 1234 5678",
    age: 38,
  },
];

export async function seedUsers(): Promise<void> {
  const users = getUsersCollection();

  for (const seedUser of SEED_USERS) {
    const passwordHash = await hashPassword(seedUser.password);
    const now = new Date();
    await users.updateOne(
      { email: seedUser.email },
      {
        $set: {
          email: seedUser.email,
          passwordHash,
          name: seedUser.name,
          country: seedUser.country,
          phone: seedUser.phone,
          age: seedUser.age,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
  }
}
