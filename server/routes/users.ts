import { Router, type Request, type Response } from "express";
import { ObjectId } from "mongodb";
import { PLANS } from "../../app/data/plans";
import { AUTH_COOKIE_MAX_AGE_MS, AUTH_COOKIE_NAME, hashPassword, signToken, verifyPassword } from "../lib/auth";
import { getUsersCollection } from "../lib/db";
import { requireAuth } from "../middleware/requireAuth";
import type { PublicUser, RegisterInput, UserDocument } from "../types";
import { validateLoginInput, validateRegisterInput } from "../lib/validation";

const PLAN_NAMES = new Set(PLANS.map((plan) => plan.name));
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: AUTH_COOKIE_MAX_AGE_MS,
};

function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    country: user.country,
    phone: user.phone,
    age: user.age,
    selectedPlan: user.selectedPlan,
  };
}

export const usersRouter = Router();

usersRouter.post("/register", async (req: Request, res: Response) => {
  const input = req.body as Partial<RegisterInput>;
  const validation = validateRegisterInput(input);
  if (!validation.ok) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  const email = input.email!.trim().toLowerCase();
  const users = getUsersCollection();
  const existing = await users.findOne({ email });
  if (existing) {
    res.status(409).json({ error: "Ya existe una cuenta con este email." });
    return;
  }

  const passwordHash = await hashPassword(input.password!);
  const now = new Date();
  const doc: UserDocument = {
    email,
    passwordHash,
    name: input.name!.trim(),
    country: input.country!.trim(),
    phone: input.phone!.trim(),
    age: Number(input.age),
    selectedPlan: undefined,
    createdAt: now,
    updatedAt: now,
  };

  const result = await users.insertOne(doc);
  const token = signToken({ userId: String(result.insertedId) });
  res.cookie(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
  res.status(201).json({ user: toPublicUser({ ...doc, _id: result.insertedId }) });
});

usersRouter.post("/login", async (req: Request, res: Response) => {
  const input = req.body as { email?: string; password?: string };
  const validation = validateLoginInput(input);
  if (!validation.ok) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  const email = input.email!.trim().toLowerCase();
  const users = getUsersCollection();
  const user = await users.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Credenciales incorrectas." });
    return;
  }

  const valid = await verifyPassword(input.password!, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Credenciales incorrectas." });
    return;
  }

  const token = signToken({ userId: String(user._id) });
  res.cookie(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
  res.status(200).json({ user: toPublicUser(user) });
});

usersRouter.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
  res.status(200).json({ ok: true });
});

usersRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
  const users = getUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(req.userId) });
  if (!user) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }
  res.status(200).json({ user: toPublicUser(user) });
});

usersRouter.patch("/me/plan", requireAuth, async (req: Request, res: Response) => {
  const { plan } = req.body as { plan?: string };
  if (!plan || !PLAN_NAMES.has(plan)) {
    res.status(400).json({ error: "Plan no válido." });
    return;
  }

  const users = getUsersCollection();
  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(req.userId) },
    { $set: { selectedPlan: plan, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  if (!result) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }
  res.status(200).json({ user: toPublicUser(result) });
});
