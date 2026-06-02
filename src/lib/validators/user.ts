import { z } from "zod";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} es obligatorio.`);

const emailSchema = requiredText("Email").email("Ingresa un email valido.").transform((value) => value.toLowerCase());
const passwordSchema = z
  .string()
  .min(6, "La password debe tener al menos 6 caracteres.");

export const loginSchema = z.object({
  email: emailSchema,
  password: requiredText("Password")
});

export const registerSchema = z.object({
  nombre: requiredText("Nombre"),
  cc: requiredText("Cedula"),
  email: emailSchema,
  password: passwordSchema
});

export const roleSchema = z.enum(["admin", "user"]);

export const createUserSchema = registerSchema.extend({
  role: roleSchema
});

export const updateUserSchema = z.object({
  nombre: requiredText("Nombre"),
  cc: requiredText("Cedula"),
  email: emailSchema,
  password: z.union([z.literal(""), passwordSchema]).optional(),
  role: roleSchema
});

export function getValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message || "Los datos enviados no son validos.";
}
