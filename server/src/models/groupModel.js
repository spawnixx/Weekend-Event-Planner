const db = require("../db");

class Group {
  static async create({ name, ownerID, inviteCode }) {
    const res = await db.query(
      `
            INSERT INTO groups (name, ownerId, inviteCode)
            VALUES ($1,$2,$3)
            RETURNING *
            `,
      [name, ownerID, inviteCode],
    );
    return res.rows[0];
  }

  static async findById(id) {
    const res = await db.query(
      `
            SELECT *
            FROM groups
            WHERE id = $1
        `,
      [id],
    );
    return res.rows[0];
  }
  // Revisit Schema Junction Table
  // static async addMember(groupId,userId){
  //     const res = await db.query(
  //         `
  //         UPDATE groups
  //         SET
  //         `
  //     )
}

module.exports = Group;
