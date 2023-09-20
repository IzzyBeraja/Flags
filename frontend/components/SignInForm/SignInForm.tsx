import type { FormEvent } from "react";

import { Button, Paper, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export type SignInFormFields = {
  email: string;
  password: string;
};

type Props = {
  onSubmit: (values: SignInFormFields, event: FormEvent<HTMLFormElement>) => void;
};

export default function SignInForm({ onSubmit }: Props) {
  const form = useForm<SignInFormFields>({
    initialValues: {
      email: "",
      password: "",
    },
  });
  return (
    <Paper maw={400} miw={300} p="md" radius="md" withBorder>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput label="Email Address" {...form.getInputProps("email")} />
          <PasswordInput label="Password" {...form.getInputProps("password")} />
          <Button type="submit">Sign In</Button>
        </Stack>
      </form>
    </Paper>
  );
}
