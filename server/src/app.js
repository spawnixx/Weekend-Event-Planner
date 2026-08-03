import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { db } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { router as userRoutes } from "./routes/userRoutes.js";
import { router as groupRoutes } from "./routes/groupRoutes.js";
import ticketmasterRoutes from "./routes/ticketmasterRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/groups", groupRoutes);
app.use("/ticketmaster", ticketmasterRoutes);

app.use(errorHandler);

app.get("/", async (req, res) => {
  const result = await db.query("SELECT NOW()");

  res.json({
    status: "ok",
    dbTime: result.rows[0].now,
  });
});

export { app };
