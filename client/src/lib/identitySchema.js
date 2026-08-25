import { z } from "zod";

export const identitySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),

  lastName: z.string().trim().min(1, "Last name is required"),

  email: z.email("Invalid email").trim().toLowerCase(),
});
