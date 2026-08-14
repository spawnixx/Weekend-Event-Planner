import { z } from "zod";

export const eventSchema = z
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
    googleMapsApiId: z.string().optional(),
    ticketMasterId: z.string().optional(),
    eventImageUrl: z.url().optional().or(z.literal("")),
  })
  .refine((data) => !data.endDate || data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End date must be after the start date",
  })
  .refine((data) => data.votingEnds < data.startDate, {
    path: ["votingEnds"],
    message: "Voting must end before the event begins.",
  });
