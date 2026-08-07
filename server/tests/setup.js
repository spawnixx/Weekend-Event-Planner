import { beforeEach, afterAll } from "vitest";
import { db } from "../src/db.js";

beforeEach(async () => {
  await db.query(`
    TRUNCATE TABLE
      event_votes,
      events,
      group_members,
      groups,
      users
    RESTART IDENTITY CASCADE;
  `);
});

afterAll(async () => {
  await db.end();
});
