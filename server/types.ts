import type { ObjectId } from "mongodb";

export interface UserDocument {
  readonly _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  country: string;
  phone: string;
  age: number;
  selectedPlan: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  country: string;
  phone: string;
  age: number;
  selectedPlan: string | undefined;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  country: string;
  phone: string;
  age: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export class AppError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}
