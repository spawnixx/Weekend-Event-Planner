import { z } from "zod";

export const editEventSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    startDate: z.date(),
    endDate: z.date().nullable().optional(),
    votingEnds: z.date(),
    location: z.string().min(1, "Location is required"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Cannot exceed 500 characters")
      .trim(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End Date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.votingEnds) < new Date(data.startDate), {
    path: ["votingEnds"],
    message: "Voting must end before the event begins",
  });
