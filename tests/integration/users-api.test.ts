import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../../server/app";
import { AUTH_COOKIE_NAME } from "../../server/lib/constants";
import { closeDatabaseConnection, connectToDatabase, getUsersCollection } from "../../server/lib/db";

let mongoServer: MongoMemoryServer;
const app = createApp();

const VALID_USER = {
  email: "ana@example.com",
  password: "Sup3rSecret!",
  name: "Ana García",
  country: "España",
  phone: "+34600111222",
  age: 29,
};

beforeAll(async () => {
  process.env.JWT_SECRET = "integration-test-secret";
  mongoServer = await MongoMemoryServer.create();
  await connectToDatabase(mongoServer.getUri());
}, 60_000);

afterEach(async () => {
  await getUsersCollection().deleteMany({});
});

afterAll(async () => {
  await closeDatabaseConnection();
  await mongoServer.stop();
});

function extractCookie(response: request.Response): string {
  const setCookie = response.headers["set-cookie"];
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  const authCookie = cookies.find((cookie: string) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (!authCookie) throw new Error("Auth cookie not found in response");
  return authCookie;
}

describe("POST /api/users/register", () => {
  it("creates a user with a bcrypt passwordHash, never the plain password", async () => {
    const response = await request(app).post("/api/users/register").send(VALID_USER);
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(VALID_USER.email);
    expect(response.body.user.passwordHash).toBeUndefined();

    const stored = await getUsersCollection().findOne({ email: VALID_USER.email });
    expect(stored).toBeTruthy();
    expect(stored?.passwordHash).not.toBe(VALID_USER.password);
  });

  it("sets an httpOnly auth cookie on success", async () => {
    const response = await request(app).post("/api/users/register").send(VALID_USER);
    const authCookie = extractCookie(response);
    expect(authCookie).toMatch(/HttpOnly/i);
  });

  it("rejects a duplicate email without creating a second document", async () => {
    await request(app).post("/api/users/register").send(VALID_USER);
    const second = await request(app).post("/api/users/register").send(VALID_USER);

    expect(second.status).toBe(409);
    const count = await getUsersCollection().countDocuments({ email: VALID_USER.email });
    expect(count).toBe(1);
  });

  it("rejects an invalid payload with 400 and field errors", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ ...VALID_USER, email: "not-an-email" });
    expect(response.status).toBe(400);
    expect(response.body.errors.email).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeAll(async () => {
    await request(app).post("/api/users/register").send(VALID_USER);
  });

  it("returns a signed session cookie for correct credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: VALID_USER.email, password: VALID_USER.password });
    expect(response.status).toBe(200);
    expect(extractCookie(response)).toBeTruthy();
  });

  it("rejects a wrong password without leaking which field was wrong", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: VALID_USER.email, password: "wrong-password" });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Credenciales incorrectas.");
  });

  it("rejects an unknown email with the same generic error", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "unknown@example.com", password: "whatever123" });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Credenciales incorrectas.");
  });
});

describe("GET /api/users/me", () => {
  it("returns the authenticated user without passwordHash", async () => {
    const registerResponse = await request(app).post("/api/users/register").send(VALID_USER);
    const cookie = extractCookie(registerResponse);

    const meResponse = await request(app).get("/api/users/me").set("Cookie", cookie);
    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.email).toBe(VALID_USER.email);
    expect(meResponse.body.user.passwordHash).toBeUndefined();
  });

  it("returns 401 without a session cookie", async () => {
    const response = await request(app).get("/api/users/me");
    expect(response.status).toBe(401);
  });

  it("returns 401 for a tampered token", async () => {
    const response = await request(app).get("/api/users/me").set("Cookie", `${AUTH_COOKIE_NAME}=not-a-real-token`);
    expect(response.status).toBe(401);
  });
});

describe("PATCH /api/users/me/plan", () => {
  it("persists a valid plan on the authenticated user", async () => {
    const registerResponse = await request(app).post("/api/users/register").send(VALID_USER);
    const cookie = extractCookie(registerResponse);

    const response = await request(app).patch("/api/users/me/plan").set("Cookie", cookie).send({ plan: "Pro" });
    expect(response.status).toBe(200);
    expect(response.body.user.selectedPlan).toBe("Pro");
  });

  it("rejects a plan name that does not exist in PLANS", async () => {
    const registerResponse = await request(app).post("/api/users/register").send(VALID_USER);
    const cookie = extractCookie(registerResponse);

    const response = await request(app)
      .patch("/api/users/me/plan")
      .set("Cookie", cookie)
      .send({ plan: "NotAPlan" });
    expect(response.status).toBe(400);
  });

  it("only updates the authenticated user's document", async () => {
    const otherUser = { ...VALID_USER, email: "other@example.com" };
    await request(app).post("/api/users/register").send(otherUser);

    const registerResponse = await request(app).post("/api/users/register").send(VALID_USER);
    const cookie = extractCookie(registerResponse);
    await request(app).patch("/api/users/me/plan").set("Cookie", cookie).send({ plan: "Elite" });

    const other = await getUsersCollection().findOne({ email: otherUser.email });
    expect(other?.selectedPlan).toBeUndefined();
  });
});

describe("POST /api/users/logout", () => {
  it("clears the session so a subsequent /me call is unauthorized", async () => {
    const registerResponse = await request(app).post("/api/users/register").send(VALID_USER);
    const cookie = extractCookie(registerResponse);

    const logoutResponse = await request(app).post("/api/users/logout").set("Cookie", cookie);
    expect(logoutResponse.status).toBe(200);

    const clearedCookie = extractCookie(logoutResponse);
    const meResponse = await request(app).get("/api/users/me").set("Cookie", clearedCookie);
    expect(meResponse.status).toBe(401);
  });
});
