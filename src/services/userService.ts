import { User, UserFormPayload } from "@/types/user";
import { apiClient, getApiErrorMessage } from "@/lib/apiClient";
import { createUserSchema, getValidationMessage, updateUserSchema } from "@/lib/validators/user";
import { ZodError } from "zod";

export async function getUsers(): Promise<User[]> {
  try {
    const { data } = await apiClient.get<{ users: User[] }>("/api/users");
    return data.users;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No fue posible consultar los usuarios."));
  }
}

export async function createUser(payload: UserFormPayload): Promise<User> {
  let validatedPayload: ReturnType<typeof createUserSchema.parse>;

  try {
    validatedPayload = createUserSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getValidationMessage(error));
    }

    throw error;
  }

  try {
    const { data } = await apiClient.post<{ user: User }>("/api/users", validatedPayload);
    return data.user;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No fue posible crear el usuario."));
  }
}

export async function updateUser(id: string, payload: UserFormPayload): Promise<User> {
  let validatedPayload: ReturnType<typeof updateUserSchema.parse>;

  try {
    validatedPayload = updateUserSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getValidationMessage(error));
    }

    throw error;
  }

  try {
    const { data } = await apiClient.put<{ user: User }>(`/api/users/${id}`, validatedPayload);
    return data.user;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No fue posible actualizar el usuario."));
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/users/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No fue posible eliminar el usuario."));
  }
}
