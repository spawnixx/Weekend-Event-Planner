import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z.string().min(1, "Description is required"),
    googleMapsApiId: z.string().optional(),
    ticketMasterId: z.string().optional(),
    eventImageUrl: z.string().url().optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End Date must be after start date",
    path: ["endDate"],
  });
