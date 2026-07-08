import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../../../server/app";
import { connectToDatabase } from "../../../server/lib/db";
import { seedUsers } from "../../../server/lib/seedUsers";

const PORT = 4100;

async function main(): Promise<void> {
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "e2e-test-secret";
  const mongo = await MongoMemoryServer.create();
  await connectToDatabase(mongo.getUri());
  await seedUsers();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`e2e api ready on port ${PORT}`);
  });
}

main().catch((error: unknown) => {
  console.error("Failed to start e2e API", error);
  process.exit(1);
});
