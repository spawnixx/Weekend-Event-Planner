import { db } from "../db.js";

export class Group {
  static async createGroup({ name, ownerId, inviteCode }) {
    const res = await db.query(
      `
            INSERT INTO groups (name, owner_id, invite_code)
            VALUES ($1,$2,$3)
            RETURNING *
            `,
      [name, ownerId, inviteCode],
    );
    return res.rows[0];
  }

  static async findById(groupId, userId) {
    const res = await db.query(
      `
      SELECT g.*
      FROM groups g
      JOIN group_members gm
        ON gm.group_id = g.id
      WHERE g.id = $1
      AND gm.user_id = $2
        `,
      [groupId, userId],
    );
    return res.rows[0];
  }
  static async findByInviteCode(inviteCode) {
    const res = await db.query(
      `
      SELECT *
      FROM groups
      WHERE invite_code = $1 
      `,
      [inviteCode],
    );
    return res.rows[0];
  }

  static async findUserGroups(userId) {
    const res = await db.query(
      `
      SELECT g.*
      FROM groups g
      JOIN group_members gm
        ON gm.group_id = g.id
      WHERE gm.user_id = $1
      ORDER BY g.name
      `,
      [userId],
    );
    return res.rows;
  }

  static async addMember(groupId, userId) {
    const res = await db.query(
      `
          INSERT INTO group_members (group_id, user_id)
          Values ($1,$2)
          ON CONFLICT (user_id, group_id) DO NOTHING
          RETURNING *
          `,
      [groupId, userId],
    );
    return res.rows[0];
  }

  static async memberCheck(groupId, userId) {
    const res = await db.query(
      `
      SELECT 1
      FROM group_members
      WHERE group_id = $1 AND user_id = $2
      `,
      [groupId, userId],
    );
    return res.rows.length > 0;
  }

  static async removeMember(groupId, userId) {
    const res = await db.query(
      `
    DELETE FROM group_members
    WHERE group_id = $1 AND user_id = $2
    `,
      [groupId, userId],
    );
    return `ID: ${userId} removed`;
  }
}
