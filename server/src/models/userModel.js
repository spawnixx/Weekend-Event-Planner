import { db } from "../db.js";
import bcrypt from "bcrypt";
export class User {
  static async create({ firstName, lastName, email, password }) {
    const result = await db.query(
      `
      INSERT INTO users (firstName, lastName, email, password)
      VALUES ($1,$2,$3,$4)
      RETURNING id, firstName, lastName, email
      `,
      [firstName, lastName, email, password],
    );

    return result.rows[0];
  }
  static async updateUser({ id, firstName, lastName, email }) {
    const result = await db.query(
      `
      UPDATE users
      SET firstName = COALESCE($2, firstName ),
       lastName = COALESCE($3, lastName), 
       email = COALESCE($4,email)
      WHERE id = $1
      RETURNING id, firstName, lastName, email
      `,
      [id, firstName, lastName, email],
    );
    return result.rows[0];
  }

  static async verifyPassword(userId, currentPassword) {
    const res = await db.query(
      `
      SELECT password
      FROM users
      WHERE id = $1
      `,
      [userId],
    );
    const user = res.rows[0];

    if (!user) return false;
    return bcrypt.compare(currentPassword, user.password);
  }

  static async updatePassword(userId, newPassword) {
    await db.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2
      `,
      [newPassword, userId],
    );
  }

  static async findByEmail(email) {
    const result = await db.query(
      `
      SELECT id, firstName, lastName, email, password 
      FROM users
      WHERE email = $1
      `,
      [email],
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `
      SELECT id, firstName, lastName, email 
      FROM users
      WHERE id = $1   
      `,
      [id],
    );
    return result.rows[0];
  }
}
