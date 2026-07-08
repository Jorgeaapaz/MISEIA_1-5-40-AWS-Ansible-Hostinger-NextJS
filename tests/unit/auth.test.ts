import { beforeAll, describe, expect, it } from "vitest";
import { hashPassword, signToken, verifyPassword, verifyToken } from "../../server/lib/auth";

beforeAll(() => {
  process.env.JWT_SECRET = "unit-test-secret";
});

describe("password hashing", () => {
  it("hashes are non-reversible and never equal the plaintext", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    expect(hash).not.toBe("Sup3rSecret!");
    expect(hash.length).toBeGreaterThan(20);
  });

  it("verifyPassword returns true for the correct password", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    await expect(verifyPassword("Sup3rSecret!", hash)).resolves.toBe(true);
  });

  it("verifyPassword returns false for an incorrect password", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });
});

describe("JWT sign/verify", () => {
  it("a valid token decodes to the expected payload", () => {
    const token = signToken({ userId: "user-123" });
    const payload = verifyToken(token);
    expect(payload).toEqual({ userId: "user-123" });
  });

  it("a tampered token is rejected", () => {
    const token = signToken({ userId: "user-123" });
    const tampered = `${token}tampered`;
    expect(verifyToken(tampered)).toBeUndefined();
  });

  it("garbage input is rejected", () => {
    expect(verifyToken("not-a-jwt")).toBeUndefined();
  });
});
