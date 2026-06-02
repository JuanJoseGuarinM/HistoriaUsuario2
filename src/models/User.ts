import { Schema, model, models } from "mongoose";

export type Role = "admin" | "user";

export type UserDocument = {
  _id: string;
  nombre: string;
  cc: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

const userSchema = new Schema<UserDocument>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    cc: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

export const User = models.User || model<UserDocument>("User", userSchema);
