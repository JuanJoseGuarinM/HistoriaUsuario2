import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };

global.mongooseCache = cached;

export async function connectToDatabase() {
  const mongoUri = process.env.DATABASE_URL;
  const mongoDb = process.env.DATABASE_NAME;

  if (!mongoUri) {
    throw new Error("Define DATABASE_URL en las variables de entorno.");
  }

  if (!mongoDb) {
    throw new Error("Define DATABASE_NAME en las variables de entorno.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, {
        dbName: mongoDb,
        serverSelectionTimeoutMS: 8000
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
