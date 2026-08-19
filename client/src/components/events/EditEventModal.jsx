import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editEventSchema } from "@/lib/editEventSchema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { updateEvent } from "@/api/eventApi";
import DateTimePicker from "@/components/events/DateTimePicker";

export default function EditEventModal({ event, onEventChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isConfirmed = event.status === "confirmed";
  const getEditValues = (event) => ({
    title: event.title ?? "",
    startDate: event.startdate ? new Date(event.startdate) : undefined,
    endDate: event.enddate ? new Date(event.enddate) : null,
    location: event.location ?? "",
    description: event.description ?? "",
    votingEnds: event.votingends ? new Date(event.votingends) : undefined,
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(editEventSchema),
    defaultValues: getEditValues(event),
  });

  useEffect(() => {
    reset(getEditValues(event));
  }, [event, reset]);

  async function onSubmit(values) {
    try {
      const updates =
        event.status === "confirmed"
          ? {
              startDate: values.startdate,
              endDate: values.enddate,
              location: values.location,
              description: values.description,
            }
          : values;
      const data = await updateEvent(event.groupid, event.id, updates);

      toast.success(
        event.status === "confirmed"
          ? "Confirmed event details updated"
          : "Event updated",
      );

      await onEventChange(data.event);

      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Unable to update event");
    }
  }

  function handleOpenChange(open) {
    setDialogOpen(open);

    if (!open) {
      reset({
        title: event.title ?? "",
        location: event.location ?? "",
        description: event.description ?? "",
      });
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="on"
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {!isConfirmed && (
              <Field className="form-row">
                <FieldLabel>Event Title</FieldLabel>
                <div className="space-y-1">
                  <Input id="title" {...register("title")} />

                  {errors.title && (
                    <FieldError>{errors.title.message}</FieldError>
                  )}
                </div>
              </Field>
            )}
            <Field className="form-row">
              <FieldLabel>Start Date</FieldLabel>
              <div className="space-y-1">
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
              </div>
            </Field>
            <Field className="form-row">
              <FieldLabel>End Date</FieldLabel>
              <div className="space-y-1">
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
              </div>
            </Field>
            <Field className="form-row">
              <FieldLabel>Location</FieldLabel>
              <div className="space-y-1">
                <Input
                  placeholder="123 Main Street"
                  {...register("location")}
                />

                {errors.location && (
                  <FieldError>{errors.location.message}</FieldError>
                )}
              </div>
            </Field>
            <Field className="form-row">
              <FieldLabel>Description</FieldLabel>
              <div className="space-y-1">
                <textarea
                  rows="4"
                  placeholder="Tell your group what to bring, expect, or prepare..."
                  className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                  {...register("description")}
                />

                {errors.description && (
                  <FieldError>{errors.description.message}</FieldError>
                )}
              </div>
            </Field>

            {!isConfirmed && (
              <Field className="form-row">
                <FieldLabel>Voting Ends</FieldLabel>
                <div className="space-y-1">
                  <Controller
                    name="votingEnds"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select date to end voting"
                      />
                    )}
                  />

                  {errors.votingEnds && (
                    <FieldError>{errors.votingEnds.message}</FieldError>
                  )}
                </div>
              </Field>
            )}
          </FieldGroup>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving changes..." : "Save Changes"}
            </Button>

            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
