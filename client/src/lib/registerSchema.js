import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
