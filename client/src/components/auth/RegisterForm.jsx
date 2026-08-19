import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/lib/registerSchema";
import { registerUser } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const data = await registerUser(values);

      login(data);

      const pendingInvite = localStorage.getItem("pendingInvite");
      if (pendingInvite) {
        navigate(`/join/${pendingInvite}`);
      } else {
        navigate("/groups");
      }
      toast.success("Account created", {
        description: `Welcome, ${data.user.firstname}!`,
      });
      reset();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  const submitHandler = handleSubmit(onSubmit);
  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field className="form-row">
              <FieldLabel>First Name</FieldLabel>
              <Input placeholder="John" {...register("firstName")} />
              {errors.firstName && (
                <FieldError>{errors.firstName.message}</FieldError>
              )}
            </Field>

            <Field className="form-row">
              <FieldLabel>Last Name</FieldLabel>
              <Input placeholder="Doe" {...register("lastName")} />
              {errors.lastName && (
                <FieldError>{errors.lastName.message}</FieldError>
              )}
            </Field>

            <Field className="form-row">
              <FieldLabel>Email</FieldLabel>
              <Input placeholder="JohnDoe@email.com" {...register("email")} />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field className="form-row">
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
            </Field>
            <Field className="form-row">
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      <Field orientation="horizontal">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Submit"}
        </Button>

        <Button type="button" variant="outline" onClick={() => reset()}>
          Reset
        </Button>
      </Field>
    </form>
  );
}

export default RegisterForm;
