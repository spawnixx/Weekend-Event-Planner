import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { groupSchema } from "../../lib/groupSchema";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

function CreateGroupModal({ onGroupChange }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(groupSchema),
  });
  const onSubmit = async (values) => {
    console.log("submitting:", values);
    const res = await fetch("http://localhost:3001/groups/create", {
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
      return;
    }
    console.log("Group created:", data);
    await onGroupChange();
    reset();
    setOpen(false);
  };
  const submitHandler = handleSubmit(onSubmit);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Group</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler}>
          <DialogHeader>
            <DialogTitle>Create a new group</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Group Name</Label>
              <Input placeholder="Book Club" {...register("name")} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating group..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGroupModal;
