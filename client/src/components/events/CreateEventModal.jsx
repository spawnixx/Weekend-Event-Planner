import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/lib/eventSchema";
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

import { useState } from "react";

export default function CreateEventModal({ groupId, onEventCreated }) {
  const [dialogOpen, setDialogOpen] = useState(false);

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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Event</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler} autoComplete="off">
          <DialogHeader>
            <DialogTitle>Create a new event</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field id="title">
              <FieldLabel>
                Event Title
                <Input {...register("title")} />
              </FieldLabel>
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>
            <FieldGroup>
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
            </FieldGroup>
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
                  name="description"
                  rows="4"
                  cols="40"
                  placeholder="Tell your group what to bring, expect, or prepare..."
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
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating event..." : "Create Event"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
