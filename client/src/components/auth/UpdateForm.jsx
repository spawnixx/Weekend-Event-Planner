import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema } from "@/lib/updateSchema";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { getCurrentUser, updateCurrentUser } from "@/api/authApi";
function UpdateForm() {
  const [setUser] = useState(null);
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
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();

        setUser(data);
        const profile = data.user ?? data;

        reset({
          firstName: profile.firstName ?? profile.firstname ?? "",
          lastName: profile.lastName ?? profile.lastname ?? "",
          email: profile.email ?? "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.log("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [reset]);
  const onSubmit = async (values) => {
    try {
      const data = await updateCurrentUser(values);

      console.log("Profile Updated:", data);
      toast.success("Profile Updated!");
      setUser(data);
      reset(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  /// Change to icon (NTH)
  if (loading) return <p>Loading Profile...</p>;

  const submitHandler = handleSubmit(onSubmit);
  return (
    <form onSubmit={submitHandler} autoComplete="false">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Update Profile</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input {...register("firstName")} />
              {errors.firstName && (
                <FieldError>{errors.firstName.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input {...register("lastName")} />
              {errors.lastName && (
                <FieldError>{errors.lastName.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...register("email")} />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel>Current Password</FieldLabel>
              <Input type={"password"} {...register("currentPassword")} />
              {errors.currentPassword && (
                <FieldError>{errors.currentPassword.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>New Password</FieldLabel>
              <Input type={"password"} {...register("newPassword")} />
              {errors.newPassword && (
                <FieldError>{errors.newPassword.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input type={"password"} {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
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
