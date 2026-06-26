import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema } from "../../lib/updateSchema";

import { Button } from "../ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";

function UpdateForm() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);

          reset({
            firstName: data.firstname || "",
            lastName: data.lastname || "",
            email: data.email || "",
          });
        }
      } catch (err) {
        console.log("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [reset]);
  const onSubmit = async (values) => {
    const res = await fetch("http://localhost:3001/users/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
      return;
    }

    console.log("Profile Updated:", data);
    setUser(data);
    reset(data);
  };

  /// Change to icon (NTH)
  if (loading) return <p>Loading Profile...</p>;

  const submitHandler = handleSubmit(onSubmit);
  return (
    <form onSubmit={submitHandler}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Update Profile</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input {...register("firstName")} />
            </Field>
            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input {...register("lastName")} />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...register("email")} />
            </Field>
          </FieldGroup>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}

export default UpdateForm;
