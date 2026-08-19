import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { identitySchema } from "@/lib/identitySchema";

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
function IdentityForm() {
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();

        const profile = data.user ?? data;

        reset({
          firstName: profile.firstName ?? profile.firstname ?? "",
          lastName: profile.lastName ?? profile.lastname ?? "",
          email: profile.email ?? "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [reset]);
  const onSubmit = async (values) => {
    try {
      const data = await updateCurrentUser(values);

      toast.success("Profile Updated!");
      reset(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  if (loading) return <p>Loading Profile...</p>;

  const submitHandler = handleSubmit(onSubmit);
  return (
    <form onSubmit={submitHandler} autoComplete="false" className="space-y-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Update Profile</FieldLegend>
          <FieldGroup>
            <Field className="form-row">
              <FieldLabel>First Name</FieldLabel>
              <div>
                <Input {...register("firstName")} />
                {errors.firstName && (
                  <FieldError>{errors.firstName.message}</FieldError>
                )}
              </div>
            </Field>
            <Field className="form-row">
              <FieldLabel>Last Name</FieldLabel>
              <Input {...register("lastName")} />
              {errors.lastName && (
                <FieldError>{errors.lastName.message}</FieldError>
              )}
            </Field>
            <Field className="form-row">
              <FieldLabel>Email</FieldLabel>
              <Input {...register("email")} />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
          </FieldGroup>

          <div className="mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}

export default IdentityForm;
