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

  static async findByIdWithMembers(id) {
    const res = await db.query(
      `
    SELECT
      e.*,

      COUNT(ev.userid) FILTER (WHERE ev.vote = TRUE) AS votes_for,
      COUNT(ev.userid) FILTER (WHERE ev.vote = FALSE) AS votes_against,

      json_agg(
        json_build_object(
          'id', u.id,
    'name', u.firstname || ' ' || u.lastname,
    'initials', LEFT(u.firstname,1) || LEFT(u.lastname,1),
    'vote', ev.vote
        )
        ORDER BY u.firstname
      ) AS members

    FROM events e

    JOIN group_members gm
      ON gm.group_id = e.groupid

    JOIN users u
      ON u.id = gm.user_id

    LEFT JOIN event_votes ev
      ON ev.eventid = e.id
      AND ev.userid = u.id

    WHERE e.id = $1

    GROUP BY e.id
    `,
      [id],
    );

    return res.rows[0];
  }

  static async findByGroup(groupId) {
    const res = await db.query(
      `
          SELECT
      e.*,

      COUNT(ev.userid) FILTER (WHERE ev.vote = TRUE) AS votes_for,
      COUNT(ev.userid) FILTER (WHERE ev.vote = FALSE) AS votes_against,

      json_agg(
        json_build_object(
          'id', u.id,
    'name', u.firstname || ' ' || u.lastname,
    'initials', LEFT(u.firstname,1) || LEFT(u.lastname,1),
    'vote', ev.vote
        )
        ORDER BY u.firstname
      ) AS members

    FROM events e

    JOIN group_members gm
      ON gm.group_id = e.groupid

    JOIN users u
      ON u.id = gm.user_id

    LEFT JOIN event_votes ev
      ON ev.eventid = e.id
     AND ev.userid = u.id

    WHERE e.groupid = $1

    GROUP BY e.id

    ORDER BY e.startdate;
            `,
      [groupId],
    );
    return res.rows;
  }

  static async vote({ eventId, userId, vote }) {
    const res = await db.query(
      `
    INSERT INTO event_votes (
      eventid,
      userid,
      vote
    )
    VALUES ($1, $2, $3)

    ON CONFLICT (eventid, userid)
    DO UPDATE SET vote = EXCLUDED.vote

    RETURNING *
    `,
      [eventId, userId, vote],
    );

    return res.rows[0];
  }

  static async updateStatus(eventId, status) {
    const res = await db.query(
      `
    UPDATE events
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
      [status, eventId],
    );
    return res.rows[0];
  }

  static async closeExpiredEvents() {
    await db.query(
      `
    UPDATE events
    SET status = 'closed'
    WHERE status = 'proposed'
    AND enddate < NOW() OR votingends < NOW()
    `,
    );
  }
}
