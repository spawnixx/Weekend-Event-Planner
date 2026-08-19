import { Pool } from "pg";
import dotenv from "dotenv";

let envFile = ".env";

if (process.env.NODE_ENV === "test") {
  envFile = ".env.test";
}

if (process.env.NODE_ENV === "e2e") {
  envFile = ".env.e2e";
}

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

if (
  process.env.NODE_ENV === "e2e" &&
  !process.env.DATABASE_URL?.includes("capstone_e2e")
) {
  throw new Error("E2E SAFETY ERROR: Playwright must use capstone_e2e");
}

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { db };
