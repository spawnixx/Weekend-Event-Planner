import { z } from "zod";

export const updateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email("Invalid email"),
});
