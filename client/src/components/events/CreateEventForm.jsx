import { useForm } from "react-hook-form";
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

export default function CreateEventForm({ groupId, onEventCreated, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
  });
  const onSubmit = async (values) => {
    console.log("submitting:", values);
    const res = await fetch(`http://localhost:3001/groups/${groupId}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message);
      toast.error(data.error);
      return;
    }
    console.log("Event created:", data);
    toast.success("Event Created:", {
      description: data,
    });
    await onEventCreated();
    reset();
    setDialogOpen(false);
  };
  const submitHandler = handleSubmit(onSubmit);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="space-y-6"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>
            Event Title
            <Input {...register("title")} />
          </FieldLabel>

          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>
              Start Date
              <Input type="datetime-local" {...register("startDate")} />
            </FieldLabel>

            {errors.startDate && (
              <FieldError>{errors.startDate.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>
              End Date
              <Input type="datetime-local" {...register("endDate")} />
            </FieldLabel>

            {errors.endDate && (
              <FieldError>{errors.endDate.message}</FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel>
            Location
            <Input placeholder="123 Main Street" {...register("location")} />
          </FieldLabel>

          {errors.location && (
            <FieldError>{errors.location.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>
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
          <FieldLabel>
            Voting Ends
            <Input type="datetime-local" {...register("votingEnds")} />
          </FieldLabel>

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
