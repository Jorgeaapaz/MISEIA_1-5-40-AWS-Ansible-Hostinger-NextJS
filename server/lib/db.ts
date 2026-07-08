import { MongoClient, type Collection, type Db } from "mongodb";
import type { UserDocument } from "../types";

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectToDatabase(uri: string): Promise<Db> {
  if (db) {
    return db;
  }
  client = new MongoClient(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    ignoreUndefined: true,
  });
  await client.connect();
  db = client.db();
  await ensureIndexes(db);
  return db;
}

async function ensureIndexes(database: Db): Promise<void> {
  await database.collection<UserDocument>("users").createIndex({ email: 1 }, { unique: true });
}

export function getUsersCollection(): Collection<UserDocument> {
  if (!db) {
    throw new Error("Database not initialized — call connectToDatabase() first");
  }
  return db.collection<UserDocument>("users");
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}
