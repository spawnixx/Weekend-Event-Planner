const db = require("../db");

class User {
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
  static async patch({ id, firstName, lastName, email }) {
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

  static async findByEmail(email) {
    const result = await db.query(
      `
      SELECT id, firstName, lastName, email 
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

module.exports = User;
