import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinGroupSchema } from "@/lib/joinGroupSchema";

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
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function JoinGroupModal({ onGroupChange }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(joinGroupSchema),
  });

  const onSubmit = async (values) => {
    console.log("submitting code:", values);

    const res = await fetch("http://localhost:3001/groups/join", {
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
      toast.error(data.message);
      return;
    }
    console.log("Joined group successfully:", data);
    toast.success("Join Group Successful");
    await onGroupChange();
    reset();
    setOpen(false);
  };
  const submitHandler = handleSubmit(onSubmit);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Join a Group</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler}>
          <DialogHeader>
            <DialogTitle>Join a group via invite code</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Invite Code</Label>
              <Input placeholder="ABC123" {...register("inviteCode")} />
              {errors.inviteCode && (
                <FieldError>{errors.inviteCode.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining group..." : "Join Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default JoinGroupModal;
