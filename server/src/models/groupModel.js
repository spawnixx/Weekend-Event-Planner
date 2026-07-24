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
      SELECT
        g.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', u.id,
              'firstName', u.firstName,
              'lastName', u.lastName,
              'email', u.email,
              'role', members.role
            )
            ORDER BY
              CASE WHEN members.role = 'owner' THEN 0 ELSE 1 END,
              u.firstName,
              u.lastName
          ) FILTER (WHERE u.id IS NOT NULL),
          '[]'::json
        ) AS members
      FROM groups g

      JOIN group_members requester
        ON requester.group_id = g.id
        AND requester.user_id = $2

      LEFT JOIN group_members members
        ON members.group_id = g.id

      LEFT JOIN users u
        ON u.id = members.user_id

      WHERE g.id = $1

      GROUP BY g.id
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
  static async getMembers(groupId) {
    const result = await db.query(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        gm.role,
        gm.joined_at
      FROM group_members AS gm
      JOIN users AS u
        ON u.id = gm.user_id
      WHERE gm.group_id = $1
      ORDER BY
        CASE WHEN gm.role = 'owner' THEN 0 ELSE 1 END,
        u.first_name,
        u.last_name
    `,
      [groupId],
    );

    return result.rows;
  }

  static async removeMember(groupId, userId) {
    const res = await db.query(
      `
    DELETE FROM group_members
    WHERE group_id = $1 AND user_id = $2
    RETURNING user_id
    `,
      [groupId, userId],
    );
    return res.rows[0];
  }
}
