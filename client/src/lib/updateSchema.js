import { z } from "zod";

export const updateSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),

    lastName: z.string().trim().min(1, "Last name is required"),

    email: z.string().trim().email("Invalid email"),

    currentPassword: z.string().optional().or(z.literal("")),

    newPassword: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (value) => !value || value.length >= 6,
        "Password must be at least 6 characters",
      ),

    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.newPassword || Boolean(data.currentPassword), {
    path: ["currentPassword"],
    message: "Current password is required to change your password.",
  })
  .refine((data) => !data.newPassword || Boolean(data.confirmPassword), {
    path: ["confirmPassword"],
    message: "Please confirm your new password.",
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    },
  );
