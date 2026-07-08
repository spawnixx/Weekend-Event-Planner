import { z } from "zod";

export const joinGroupSchema = z.object({
  inviteCode: z.string().min(6, "complete invite code required"),
});
