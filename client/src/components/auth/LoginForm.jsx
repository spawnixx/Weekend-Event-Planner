import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/api/authApi";
import { loginSchema } from "@/lib/loginSchema";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
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
    try {
      const data = await loginUser(values);

      login(data.user);

      const pendingInvite = localStorage.getItem("pendingInvite");

      if (pendingInvite) {
        navigate(`/join/${pendingInvite}`);
      } else {
        navigate("/groups");
      }

      console.log("Logged in:", data);
      toast.success("Logged in");
      reset();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const submitHandler = handleSubmit(onSubmit);
  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input placeholder="YourEmail@email.com" {...register("email")} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Your Password"
              {...register("password")}
            />
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
