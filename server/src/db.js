import { Pool } from "pg";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

dotenv.config({
  path: envFile,
  override: true,
});

if (
  process.env.NODE_ENV === "test" &&
  !process.env.DATABASE_URL?.includes("capstone_test")
) {
  throw new Error("TEST SAFETY ERROR: Tests must use capstone_test");
}

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { db };
