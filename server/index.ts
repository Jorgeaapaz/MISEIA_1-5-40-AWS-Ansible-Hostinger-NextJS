import "dotenv/config";
import { createApp } from "./app";
import { connectToDatabase } from "./lib/db";

const PORT = Number(process.env.PORT) || 4000;

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  await connectToDatabase(uri);
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`dominaia users API listening on port ${PORT}`);
  });
}

main().catch((error: unknown) => {
  console.error("Failed to start dominaia users API", error);
  process.exit(1);
});
