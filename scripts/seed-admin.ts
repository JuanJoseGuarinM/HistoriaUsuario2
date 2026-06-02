/**
 * Seed script – creates or resets the admin user.
 *
 * Usage:
 *   bun run scripts/seed-admin.ts
 *
 * It reads MONGODB_URI and MONGODB_DB from .env and either:
 *   • Creates a new admin user if none exists, or
 *   • Resets the existing admin's password to the value below.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

/* ── admin credentials (plain-text, for development only) ────────── */
const ADMIN_EMAIL = "david@gmail.com";
const ADMIN_PASSWORD = "123123";
const ADMIN_NAME = "David";
const ADMIN_CC = "1098123456";

/* ── load .env manually (no dotenv dependency needed in Bun) ─────── */
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env may not exist; that's fine if env vars are already set
  }
}

async function main() {
  loadEnv();

  const uri = process.env.DATABASE_URL;
  const dbName = process.env.DATABASE_NAME;

  if (!uri || !dbName) {
    console.error("❌  DATABASE_URL and DATABASE_NAME must be set in .env");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (db: ${dbName})…`);
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 8000 });
  console.log("✅  Connected.\n");

  const UserSchema = new mongoose.Schema(
    {
      nombre: String,
      cc: String,
      email: { type: String, unique: true, lowercase: true },
      password: String,
      role: { type: String, enum: ["admin", "user"], default: "user" },
    },
    { timestamps: true }
  );

  const User =
    mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  if (existing) {
    existing.password = hashed;
    existing.role = "admin";
    existing.nombre = ADMIN_NAME;
    existing.cc = ADMIN_CC;
    await existing.save();
    console.log(`🔄  Admin user updated (${ADMIN_EMAIL}).`);
  } else {
    await User.create({
      nombre: ADMIN_NAME,
      cc: ADMIN_CC,
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
    });
    console.log(`🆕  Admin user created (${ADMIN_EMAIL}).`);
  }

  console.log(`\n   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}\n`);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
