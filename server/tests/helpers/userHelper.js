import bcrypt from "bcrypt";
import { db } from "../../src/db.js";

export async function createTestUser(overrides = {}) {
  const hashedPassword = await bcrypt.hash("password123", 12);

  const defaults = {
    firstName: "John",
    lastName: "Doe",
    email: "john@test.com",
    password: hashedPassword,
  };

  const user = { ...defaults, ...overrides };

  const result = await db.query(
    `
    INSERT INTO users
      (firstName, lastName, email, password)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *
    `,
    [user.firstName, user.lastName, user.email, user.password],
  );

  return result.rows[0];
}
