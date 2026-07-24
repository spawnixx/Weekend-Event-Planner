import { z } from "zod";

export const updateSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email("Invalid email"),
    currentPassword: z.string(),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine(
    (data) =>
      !data.newPassword || (data.currentPassword && data.confirmPassword),
    {
      path: ["newPassword"],
      message: "Current password and confirmation are required.",
    },
  )
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    },
  );
