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
  return new MongoClient(uri);
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
