const express = require("express");
const cors = require("cors");
const db = require("./db");
const errorHandler = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(errorHandler);

app.use("/users", userRoutes);
app.use("/groups", groupRoutes);

app.get("/", async (req, res) => {
  const result = await db.query("Select NOW()");

  res.json({ status: "ok", dbTime: result.rows[0].now });
});

module.exports = app;
