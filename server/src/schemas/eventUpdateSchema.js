import { z } from "zod";

export const eventUpdateSchema = z
  .object({
    title: z.string().trim().min(1, "Event title is required").optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.preprocess((value) => {
      if (value === "" || value === null) {
        return null;
      }

      return value;
    }, z.coerce.date().nullable().optional()),

    votingEnds: z.coerce.date().optional(),

    location: z.string().trim().min(1, "Location is required").optional(),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(500, "Cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.endDate > data.startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (!data.startDate || !data.votingEnds) return true;
      return data.votingEnds < data.startDate;
    },
    {
      message: "Voting must end before the event begins",
      path: ["votingEnds"],
    },
  );
