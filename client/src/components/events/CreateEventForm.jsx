import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/lib/eventSchema";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { createEvent } from "@/api/eventApi";
import DateTimePicker from "@/components/events/DateTimePicker";
export default function CreateEventForm({ groupId, onEventCreated, onCancel }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      startDate: undefined,
      endDate: undefined,
      location: "",
      description: "",
      votingEnds: undefined,
    },
  });
  const onSubmit = async (values) => {
    const data = await createEvent(groupId, values);

    console.log("Event created:", data);
    toast.success("Event Created:", {
      description: data.title,
    });
    await onEventCreated(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="space-y-6"
    >
      <FieldGroup>
        <Field>
          <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Event Title
            <Input {...register("title")} />
          </FieldLabel>

          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Start Date
            </FieldLabel>

            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select start date"
                />
              )}
            />

            {errors.startDate && (
              <FieldError>{errors.startDate.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              End Date
            </FieldLabel>

            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select end date"
                />
              )}
            />

            {errors.endDate && (
              <FieldError>{errors.endDate.message}</FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Location
            <Input placeholder="123 Main Street" {...register("location")} />
          </FieldLabel>

          {errors.location && (
            <FieldError>{errors.location.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Description
            <textarea
              rows="4"
              className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Tell the group what to expect..."
              {...register("description")}
            />
          </FieldLabel>

          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Voting Ends
          </FieldLabel>

          <Controller
            name="votingEnds"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Select voting deadline"
              />
            )}
          />

          {errors.votingEnds && (
            <FieldError>{errors.votingEnds.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating event..." : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
