import "dotenv/config";
import { closeDatabaseConnection, connectToDatabase } from "../server/lib/db";
import { SEED_USERS, seedUsers } from "../server/lib/seedUsers";

async function run(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  await connectToDatabase(uri);
  await seedUsers();

  console.log(`Seeded ${SEED_USERS.length} users into dominaia.users`);
  console.log();
  console.log("| Email | Password | Name |");
  console.log("|---|---|---|");
  for (const seedUser of SEED_USERS) {
    console.log(`| ${seedUser.email} | ${seedUser.password} | ${seedUser.name} |`);
  }

  await closeDatabaseConnection();
}

run().catch((error: unknown) => {
  console.error("Failed to seed users", error);
  process.exit(1);
});
