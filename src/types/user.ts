export type Role = "admin" | "user";

export type User = {
  _id: string;
  nombre: string;
  cc: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  nombre: string;
  cc: string;
  email: string;
  password: string;
};

export type UserFormPayload = {
  nombre: string;
  cc: string;
  email: string;
  password: string;
  role: Role;
};

export type SessionUser = Pick<User, "nombre" | "email" | "role" | "_id">;
