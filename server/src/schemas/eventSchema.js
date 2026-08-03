import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),

    startDate: z.coerce.date(),

    endDate: z.preprocess(
      (value) =>
        value === "" || value === null || value === undefined ? null : value,
      z.coerce.date().nullable(),
    ),
    location: z.string().trim().optional(),

    googleMapsApiId: z.string().optional(),

    ticketmasterId: z.string().optional(),

    eventImageUrl: z.url().optional().or(z.literal("")),

    description: z.string().trim().optional().or(z.literal("")),

    votingEnds: z.coerce.date(),
    latitude: z.coerce.number().nullable().optional(),

    longitude: z.coerce.number().nullable().optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;

      return (
        new Date(data.endDate).getTime() > new Date(data.startDate).getTime()
      );
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    },
  )
  .refine((data) => data.votingEnds < data.startDate, {
    path: ["votingEnds"],
    message: "Voting must end before the event begins.",
  });
