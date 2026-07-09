import { db } from "../db.js";

export class Event {
  static async createEvent(eventData) {
    const {
      groupId,
      title,
      startDate,
      endDate,
      googleMapsApiId,
      ticketmasterId,
      eventImageUrl,
      description,
      votingEnds,
    } = eventData;
    const res = await db.query(
      `
        INSERT INTO events (
        groupId,
        title,
        startDate,
        endDate,
        googleMapsApiId,
        ticketmasterId,
        eventImageUrl,
        description,
        votingEnds)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
      [
        groupId,
        title,
        startDate,
        endDate,
        googleMapsApiId,
        ticketmasterId,
        eventImageUrl,
        description,
        votingEnds,
      ],
    );
    return res.rows[0];
  }

  static async findById(id) {
    const res = await db.query(
      `
        SELECT *
        FROM events
        WHERE id = $1
        `,
      [id],
    );
    return res.rows[0];
  }

  static async findByGroup(groupId) {
    const res = await db.query(
      `
            SELECT *
            FROM events
            WHERE groupId = $1
            `,
      [groupId],
    );
    return res.rows;
  }
}
