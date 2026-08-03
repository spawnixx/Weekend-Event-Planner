import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

export default function EditEventModal({ event, onEventChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      title: event.title ?? "",
      startDate: event.startDate ?? "",
      endDate: event.endDate ?? "",
      location: event.location ?? "",
      description: event.description ?? "",
      votingEnds: event.votingEnds ?? "",
    },
  });

  useEffect(() => {
    reset({
      title: event.title ?? "",
      location: event.location ?? "",
      description: event.description ?? "",
    });
  }, [event, reset]);

  async function onSubmit(values) {
    try {
      const res = await fetch(
        `http://localhost:3001/groups/${event.groupid}/events/${event.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Unable to update event");
        return;
      }

      toast.success("Event updated");

      await onEventChange(data.error);

      setDialogOpen(false);
    } catch (err) {
      console.error(err);
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
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field id="edit-title">
              <FieldLabel>
                Event Title
                <Input {...register("title")} />
              </FieldLabel>
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>
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
            <Field>
              <FieldLabel>
                Location
                <Input
                  placeholder="123 Main Street"
                  {...register("location")}
                />
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
                  placeholder="Tell your group what to bring, expect, or prepare..."
                  className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm"
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
