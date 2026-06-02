import { LoginPayload, RegisterPayload, SessionUser } from "@/types/user";
import { apiClient, getApiErrorMessage } from "@/lib/apiClient";
import { getValidationMessage, loginSchema, registerSchema } from "@/lib/validators/user";
import { ZodError } from "zod";

export async function login(payload: LoginPayload): Promise<SessionUser> {
  try {
    payload = loginSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getValidationMessage(error));
    }

    throw error;
  }

  try {
    const { data } = await apiClient.post<{ user: SessionUser }>("/api/auth/login", payload);
    return data.user;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No fue posible iniciar sesion."));
  }
}

export async function register(payload: RegisterPayload): Promise<SessionUser> {
  try {
    payload = registerSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getValidationMessage(error));
    }

    throw error;
  }

  try {
    const { data } = await apiClient.post<{ user: SessionUser }>("/api/auth/register", payload);
    return data.user;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No fue posible crear la cuenta."));
  }
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  try {
    const { data } = await apiClient.get<{ user: SessionUser | null }>("/api/auth/session");
    return data.user;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No fue posible consultar la sesion."));
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No fue posible cerrar sesion."));
  }
}
