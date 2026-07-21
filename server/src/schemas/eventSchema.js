import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    location: z.string().trim().optional(),

    googleMapsApiId: z.string().optional(),

    ticketmasterId: z.string().optional(),

    eventImageUrl: z.string().url().optional().or(z.literal("")),

    description: z.string().trim().min(1, "Description is required"),

    votingEnds: z.coerce.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End date must be after the start date.",
  })
  .refine((data) => data.votingEnds < data.startDate, {
    path: ["votingEnds"],
    message: "Voting must end before the event begins.",
  });
