import type { LoginInput, RegisterInput, ValidationResult } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s()-]{6,20}$/;
const MIN_AGE = 16;
const MAX_AGE = 120;
const MIN_PASSWORD_LENGTH = 8;

export function validateRegisterInput(input: Partial<RegisterInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.email || !EMAIL_PATTERN.test(input.email)) {
    errors.email = "Introduce un email válido.";
  }
  if (!input.password || input.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (!input.name || input.name.trim().length < 2) {
    errors.name = "Introduce tu nombre completo.";
  }
  if (!input.country || input.country.trim().length < 2) {
    errors.country = "Introduce tu país.";
  }
  if (!input.phone || !PHONE_PATTERN.test(input.phone)) {
    errors.phone = "Introduce un teléfono válido.";
  }
  if (
    input.age === undefined ||
    input.age === null ||
    Number.isNaN(Number(input.age)) ||
    Number(input.age) < MIN_AGE ||
    Number(input.age) > MAX_AGE
  ) {
    errors.age = `La edad debe estar entre ${MIN_AGE} y ${MAX_AGE}.`;
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true };
}

export function validateLoginInput(input: Partial<LoginInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.email || !EMAIL_PATTERN.test(input.email)) {
    errors.email = "Introduce un email válido.";
  }
  if (!input.password) {
    errors.password = "Introduce tu contraseña.";
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true };
}
