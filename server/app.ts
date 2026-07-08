import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import { usersRouter } from "./routes/users";

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/users", usersRouter);

  return app;
}
