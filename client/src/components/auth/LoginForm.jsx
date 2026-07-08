import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../lib/loginSchema";

import { Button } from "@/components/ui/button";
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
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
function LoginForm() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const res = await fetch("http://localhost:3001/users/login", {
      method: "POST",
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

    login(data);
    const pendingInvite = localStorage.getItem("pendingInvite");
    if (pendingInvite) {
      navigate(`/join/${pendingInvite}`);
    } else {
      navigate("/groups");
    }
    console.log("Logged in:", data.user);
    reset();
  };
  const submitHandler = handleSubmit(onSubmit);
  return (
    <form onSubmit={submitHandler}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Welcome Back</FieldLegend>

          <FieldDescription>Sign in to your account</FieldDescription>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input placeholder="YourEmail@email.com" {...register("email")} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input placeholder="Your Password" {...register("password")} />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
        </FieldSet>
      </FieldGroup>
      <Field orientation="horizontal">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Submit"}
        </Button>

        <Button type="button" variant="outline" onClick={() => reset()}>
          Reset
        </Button>
      </Field>
    </form>
  );
}

export default LoginForm;
