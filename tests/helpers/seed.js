import bcrypt from "bcrypt";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: "./server/.env.e2e",
  override: true,
});

export async function resetAndSeedE2EDatabase() {
  const db = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await db.connect();

  try {
    await db.query(`
      TRUNCATE TABLE
        event_votes,
        events,
        group_members,
        groups,
        users
      RESTART IDENTITY CASCADE;
    `);

    const hashedPassword = await bcrypt.hash("password123", 12);

    await db.query(
      `
      INSERT INTO users
        (firstName, lastName, email, password)
      VALUES
        ($1, $2, $3, $4)
      `,
      ["John", "Doe", "john@test.com", hashedPassword],
    );
  } finally {
    await db.end();
  }
}
