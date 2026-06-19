const express = require("express");
const db = require("./db");
const errorHandler = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(errorHandler);

app.use("/users", userRoutes);

app.get("/", async (req, res) => {
  const result = await db.query("Select NOW()");

  res.json({ status: "ok", dbTime: result.rows[0].now });
});

module.exports = app;
