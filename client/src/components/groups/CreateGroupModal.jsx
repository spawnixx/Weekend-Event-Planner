import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { groupSchema } from "@/lib/groupSchema";

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
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
      toast.error(data.message);
      return;
    }
    console.log("Group created:", data);
    toast.success("Group Created!");
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
              <FieldLabel>
                Group Name
                <Input placeholder="Book Club" {...register("name")} />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </FieldLabel>
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
