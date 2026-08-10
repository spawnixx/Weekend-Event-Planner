import { Group } from "../../src/models/groupModel.js";
export async function createTestGroup(ownerId, overrides = {}) {
  const defaults = {
    name: "Weekend Crew",
    inviteCode: "ABC123",
  };

  const groupData = {
    ...defaults,
    ...overrides,
  };

  const group = await Group.createGroup({
    name: groupData.name,
    ownerId,
    inviteCode: groupData.inviteCode,
  });

  await Group.addOwner(group.id, ownerId);
  return group;
}
