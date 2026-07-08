import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { verifyPassword } from "../../server/lib/auth";
import { closeDatabaseConnection, connectToDatabase, getUsersCollection } from "../../server/lib/db";
import { seedUsers } from "../../server/lib/seedUsers";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "seed-test-secret";
  mongoServer = await MongoMemoryServer.create();
  await connectToDatabase(mongoServer.getUri());
}, 60_000);

afterEach(async () => {
  await getUsersCollection().deleteMany({});
});

afterAll(async () => {
  await closeDatabaseConnection();
  await mongoServer.stop();
});

describe("seedUsers", () => {
  it("inserts at least 5 users, each able to log in with its documented password", async () => {
    await seedUsers();

    const users = await getUsersCollection().find({}).toArray();
    expect(users.length).toBeGreaterThanOrEqual(5);

    const ana = users.find((user) => user.email === "ana.garcia@example.com");
    expect(ana).toBeTruthy();
    await expect(verifyPassword("Ana#Pass2024", ana!.passwordHash)).resolves.toBe(true);
  });

  it("is idempotent — running it twice keeps exactly the seeded set with no duplicates", async () => {
    await seedUsers();
    await seedUsers();

    const users = await getUsersCollection().find({}).toArray();
    const emails = users.map((user) => user.email);
    expect(new Set(emails).size).toBe(emails.length);
    expect(users.length).toBe(5);
  });
});
