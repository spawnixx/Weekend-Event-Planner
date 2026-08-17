import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app.js";
import { createTestUser } from "./helpers/userHelper.js";
import { db } from "../src/db.js";
import { createTestGroup } from "./helpers/groupHelper.js";

describe("POST /groups/create", () => {
  it("returns 401 when not authenticated", async () => {
    const res = await request(app).post("/groups/create").send({
      name: "Weekend Crew",
    });

    expect(res.status).toBe(401);
  });
  it("creates a group for an authenticated user", async () => {
    await createTestUser();

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "john@test.com",
      password: "password123",
    });

    const res = await agent.post("/groups/create").send({
      name: "Weekend Crew",
    });
    expect(res.status).toBe(201);
    expect(res.body.group).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: "Weekend Crew",
        invite_code: expect.any(String),
        owner_id: expect.any(Number),
      }),
    );
  });

  it("assigns the creator as owner", async () => {
    const user = await createTestUser();

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "john@test.com",
      password: "password123",
    });

    const res = await agent.post("/groups/create").send({
      name: "Weekend Crew",
    });

    const groupId = res.body.group.id;

    const membership = await db.query(
      `
      SELECT *
      FROM group_members
      WHERE group_id = $1
        AND user_id = $2
      `,
      [groupId, user.id],
    );

    expect(membership.rows).toHaveLength(1);
    expect(membership.rows[0].role).toBe("owner");
  });

  it("stores the creator as group owner", async () => {
    const user = await createTestUser();

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "john@test.com",
      password: "password123",
    });

    const res = await agent.post("/groups/create").send({
      name: "Weekend Crew",
    });

    expect(res.body.group.owner_id).toBe(user.id);
  });
});

describe("POST /groups/invite/:inviteCode", () => {
  it("returns 401 when not authenticated", async () => {
    const res = await request(app).post("/groups/invite/ABC123");

    expect(res.status).toBe(401);
  });
  it("adds an authenticated user to the group", async () => {
    const owner = await createTestUser({
      email: "owner@test.com",
    });
    const member = await createTestUser({
      email: "member@test.com",
    });
    const group = await createTestGroup(owner.id);

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "member@test.com",
      password: "password123",
    });

    const res = await agent.post(`/groups/invite/${group.invite_code.trim()}`);

    expect(res.status).toBe(200);
    const membership = await db.query(
      `
      SELECT *
      FROM group_members
      WHERE group_id = $1
        AND user_id = $2
      `,
      [group.id, member.id],
    );

    expect(membership.rows).toHaveLength(1);
    expect(membership.rows[0].role).toBe("member");
  });
  it("rejects an invalid invite code", async () => {
    await createTestUser();

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "john@test.com",
      password: "password123",
    });

    const res = await agent.post("/groups/invite/NOTREAL");

    expect(res.status).toBe(404);
  });
  it("does not create duplicate membership", async () => {
    const owner = await createTestUser({
      email: "owner@test.com",
    });

    const member = await createTestUser({
      email: "member@test.com",
    });

    const group = await createTestGroup(owner.id);

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "member@test.com",
      password: "password123",
    });

    await agent.post(`/groups/invite/${group.invite_code.trim()}`);

    await agent.post(`/groups/invite/${group.invite_code.trim()}`);

    const membership = await db.query(
      `
      SELECT *
      FROM group_members
      WHERE group_id = $1
        AND user_id = $2
      `,
      [group.id, member.id],
    );

    expect(membership.rows).toHaveLength(1);
  });
});

describe("DELETE /groups/:groupId/members/:userId", () => {
  it("allows the owner to remove a member", async () => {
    const owner = await createTestUser({
      email: "owner@test.com",
    });
    const member = await createTestUser({
      email: "member@test.com",
    });

    const group = await createTestGroup(owner.id);

    await db.query(
      `
      INSERT INTO group_members
        (group_id, user_id)
      VALUES
        ($1, $2)
      `,
      [group.id, member.id],
    );

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "owner@test.com",
      password: "password123",
    });

    const res = await agent.delete(`/groups/${group.id}/members/${member.id}`);
    expect(res.status).toBe(200);

    const membership = await db.query(
      `
      SELECT *
      FROM group_members
      WHERE group_id = $1
        AND user_id = $2
      `,
      [group.id, member.id],
    );

    expect(membership.rows).toHaveLength(0);
  });
  it("prevents a member from removing another member", async () => {
    const owner = await createTestUser({
      email: "owner@test.com",
    });
    const member = await createTestUser({
      email: "member@test.com",
    });

    const group = await createTestGroup(owner.id);

    await db.query(
      `
      INSERT INTO group_members
        (group_id, user_id)
      VALUES
        ($1, $2)
      `,
      [group.id, member.id],
    );

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "member@test.com",
      password: "password123",
    });

    const res = await agent.delete(`/groups/${group.id}/members/${owner.id}`);
    expect(res.status).toBe(403);
    const membership = await db.query(
      `
      SELECT *
      FROM group_members
      WHERE group_id = $1
    
      `,
      [group.id],
    );

    expect(membership.rows).toHaveLength(2);
  });

  it("allows a member to leave the group", async () => {
    const owner = await createTestUser({
      email: "owner@test.com",
    });

    const member = await createTestUser({
      email: "member@test.com",
    });

    const group = await createTestGroup(owner.id);

    await db.query(
      `
    INSERT INTO group_members
      (group_id, user_id)
    VALUES
      ($1, $2)
    `,
      [group.id, member.id],
    );

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "member@test.com",
      password: "password123",
    });

    const res = await agent.delete(`/groups/${group.id}/members/${member.id}`);

    expect(res.status).toBe(200);

    const membership = await db.query(
      `
    SELECT *
    FROM group_members
    WHERE group_id = $1
      AND user_id = $2
    `,
      [group.id, member.id],
    );

    expect(membership.rows).toHaveLength(0);
  });

  it("prevents the owner from removing themselves", async () => {
    const owner = await createTestUser({
      email: "owner@test.com",
    });

    const group = await createTestGroup(owner.id);

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "owner@test.com",
      password: "password123",
    });

    const res = await agent.delete(`/groups/${group.id}/members/${owner.id}`);

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe(
      "The group owner cannot leave the group.",
    );
  });
});

describe("DELETE /groups/:groupId", () => {
  it("allows the owner to delete the group", async () => {
    const owner = await createTestUser({
      email: "owner@test.com",
    });

    const group = await createTestGroup(owner.id);

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "owner@test.com",
      password: "password123",
    });

    const res = await agent.delete(`/groups/${group.id}`);

    expect(res.status).toBe(200);

    const result = await db.query(
      `
      SELECT *
      FROM groups
      WHERE id = $1
      `,
      [group.id],
    );

    expect(result.rows).toHaveLength(0);
  });
  it("prevents a regular member from deleting the group", async () => {
    const owner = await createTestUser({
      email: "owner@test.com",
    });

    const member = await createTestUser({
      email: "member@test.com",
    });

    const group = await createTestGroup(owner.id);

    await db.query(
      `
      INSERT INTO group_members
        (group_id, user_id)
      VALUES
        ($1, $2)
      `,
      [group.id, member.id],
    );

    const agent = request.agent(app);

    await agent.post("/users/login").send({
      email: "member@test.com",
      password: "password123",
    });

    const res = await agent.delete(`/groups/${group.id}`);

    expect(res.status).toBe(403);

    const result = await db.query(
      `
      SELECT *
      FROM groups
      WHERE id = $1
      `,
      [group.id],
    );

    expect(result.rows).toHaveLength(1);
  });
});
