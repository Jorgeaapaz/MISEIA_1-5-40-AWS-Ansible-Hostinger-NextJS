import { describe, expect, it } from "vitest";
import { validateLoginInput, validateRegisterInput } from "../../server/lib/validation";

const VALID_REGISTER = {
  email: "ana@example.com",
  password: "Sup3rSecret!",
  name: "Ana García",
  country: "España",
  phone: "+34 600 111 222",
  age: 29,
};

describe("validateRegisterInput", () => {
  it("accepts a fully valid payload", () => {
    expect(validateRegisterInput(VALID_REGISTER)).toEqual({ ok: true });
  });

  it("rejects an invalid email", () => {
    const result = validateRegisterInput({ ...VALID_REGISTER, email: "not-an-email" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeDefined();
  });

  it("rejects a short password", () => {
    const result = validateRegisterInput({ ...VALID_REGISTER, password: "short" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.password).toBeDefined();
  });

  it("rejects an age outside the allowed range", () => {
    const result = validateRegisterInput({ ...VALID_REGISTER, age: 12 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.age).toBeDefined();
  });

  it("rejects a malformed phone number", () => {
    const result = validateRegisterInput({ ...VALID_REGISTER, phone: "abc" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.phone).toBeDefined();
  });

  it("rejects a missing name", () => {
    const result = validateRegisterInput({ ...VALID_REGISTER, name: "A" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });
});

describe("validateLoginInput", () => {
  it("accepts a valid email/password pair", () => {
    expect(validateLoginInput({ email: "ana@example.com", password: "anything" })).toEqual({ ok: true });
  });

  it("rejects a missing password", () => {
    const result = validateLoginInput({ email: "ana@example.com", password: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.password).toBeDefined();
  });

  it("rejects an invalid email", () => {
    const result = validateLoginInput({ email: "nope", password: "anything" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeDefined();
  });
});
