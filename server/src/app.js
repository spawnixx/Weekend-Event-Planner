import express from "express";
import cors from "cors";

import { db } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { router as userRoutes } from "./routes/userRoutes.js";
import { router as groupRoutes } from "./routes/groupRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/groups", groupRoutes);

app.use(errorHandler);

app.get("/", async (req, res) => {
  const result = await db.query("SELECT NOW()");

  res.json({
    status: "ok",
    dbTime: result.rows[0].now,
  });
});

export { app };
