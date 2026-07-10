import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    votingEnds: z.string().min(1, "Voting deadline is required"),
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
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End Date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.votingEnds) < new Date(data.startDate), {
    path: ["votingEnds"],
    message: "Voting must end before the event begins",
  });
