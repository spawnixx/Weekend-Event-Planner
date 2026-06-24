import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../../lib/registerSchema";

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

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values) => {
    const res = await fetch("http://localhost:3001/users/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message);
      return;
    }

    console.log("User created:", data);

    reset();
  };
  const submitHandler = handleSubmit(onSubmit);
  return (
    <form onSubmit={submitHandler}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Create Account</FieldLegend>

          <FieldDescription>
            Join and start planning your next event
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input placeholder="John" {...register("firstName")} />
              {errors.firstName && (
                <FieldError>{errors.firstName.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input placeholder="Doe" {...register("lastName")} />
              {errors.lastName && (
                <FieldError>{errors.lastName.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input placeholder="JohnDoe@email.com" {...register("email")} />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                placeholder="At least 8 characters"
                {...register("password")}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
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
