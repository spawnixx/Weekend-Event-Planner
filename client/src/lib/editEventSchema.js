import { z } from "zod";

export const editEventSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    startDate: z.coerce.date({
      error: "Start date is required",
    }),
    endDate: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      return value;
    }, z.coerce.date().nullable()),
    votingEnds: z.coerce.date({
      error: "Voting Deadline is required",
    }),
    location: z.string().min(1, "Location is required"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Cannot exceed 500 characters")
      .trim(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.endDate > data.startDate;
    },
    {
      message: "End Date must be after start date",
      path: ["endDate"],
    },
  )
  .refine((data) => data.votingEnds < data.startDate, {
    path: ["votingEnds"],
    message: "Voting must end before the event begins",
  });
