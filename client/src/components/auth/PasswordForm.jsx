import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updateCurrentUser } from "@/api/authApi";
import { passwordSchema } from "@/lib/passwordSchema";

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

export default function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    try {
      const passwordData = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      await updateCurrentUser(passwordData);

      reset();
      toast.success("Password updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend>Change password</FieldLegend>

        <p className="mb-5 text-sm text-muted-foreground">
          Enter your current password before choosing a new one.
        </p>

        <FieldGroup>
          <Field>
            <FieldLabel>Current Password</FieldLabel>

            <Input type="password" {...register("currentPassword")} />

            {errors.currentPassword && (
              <FieldError>{errors.currentPassword.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>New Password</FieldLabel>

            <Input
              type="password"
              autoComplete="new-password"
              {...register("newPassword")}
            />

            {errors.newPassword && (
              <FieldError>{errors.newPassword.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Confirm New Password</FieldLabel>

            <Input
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>

          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
