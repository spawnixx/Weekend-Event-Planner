import { db } from "../db.js";

export class Group {
  static async create({ name, ownerId, inviteCode }) {
    const res = await db.query(
      `
            INSERT INTO groups (name, owner_id, inviteCode)
            VALUES ($1,$2,$3)
            RETURNING *
            `,
      [name, ownerId, inviteCode],
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

  static async findUserGroups(userId) {
    const res = await db.query(
      `
      SELECT groupId from group_members
      WHERE userId = $1
      RETURNING groupId
      `,
      [userId],
    );
  }

  static async addMember(groupId, userId) {
    const res = await db.query(
      `
          INSERT INTO group_members (groupId, userId)
          Values ($1,$2)
          RETURNING *
          `,
      [groupId, userId],
    );
    return res.rows[0];
  }

  static async removeMember(groupId, userId) {
    const res = await db.query(
      `
    DELETE FROM group_members
    WHERE groupId = $1 AND userId = $2
    `,
      [groupId, userId],
    );
    return `ID: ${userId} removed`;
  }
}
