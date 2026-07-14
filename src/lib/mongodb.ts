import { MongoClient, Db, GridFSBucket } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn("MONGODB_URI is not set. Database features will fail until it is configured.");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient(): MongoClient {
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it to .env.local / Render env.");
  }
  return new MongoClient(uri, {
    // Prefer IPv4 — avoids some cloud DNS/TLS handshake failures
    family: 4,
    serverSelectionTimeoutMS: 15000,
  });
}

export function explainMongoError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (
    message.includes("tlsv1 alert internal error") ||
    message.includes("SSL alert number 80") ||
    message.includes("ENOTFOUND") ||
    message.includes("Server selection timed out")
  ) {
    return (
      "MongoDB Atlas blocked this server IP. " +
      "In Atlas go to Security → Network Access → Add IP Address → " +
      "Allow Access from Anywhere (0.0.0.0/0), wait 1–2 minutes, then retry."
    );
  }
  return message;
}

const clientPromise =
  global._mongoClientPromise ??
  (global._mongoClientPromise = createClient().connect());

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "shivbless");
}

export async function getMediaBucket(): Promise<GridFSBucket> {
  const db = await getDb();
  return new GridFSBucket(db, { bucketName: "productImages" });
}
