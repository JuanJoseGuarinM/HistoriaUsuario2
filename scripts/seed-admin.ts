import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/models/User";
import { connectToDatabase } from "../src/lib/mongodb";
import { resolve } from "path";
import { readFileSync } from "fs";

// Cargar variables de entorno del archivo .env
try {
  const content = readFileSync(resolve(process.cwd(), ".env"), "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
} catch {}

async function main() {
  await connectToDatabase();
  
  const email = "david@gmail.com";
  const password = await bcrypt.hash("123123", 10);

  // Crear o actualizar el administrador en un solo paso
  await User.updateOne(
    { email },
    { 
      nombre: "David", 
      cc: "1098123456", 
      email, 
      password, 
      role: "admin" 
    },
    { upsert: true }
  );

  console.log("✅ Administrador (david@gmail.com) configurado con éxito.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Error en la inicialización:", err);
  process.exit(1);
});
