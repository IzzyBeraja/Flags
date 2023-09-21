import { Button, Paper, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export type SignUpFormFields = {
  email: string;
  password: string;
  name: string;
};

type Props = {
  /** When form is submitted */
  onSubmit: (values: SignUpFormFields) => void;
  /** Determines if the form is loading */
  loading: boolean;
};

export default function SignInForm({ onSubmit, loading }: Props) {
  const form = useForm<SignUpFormFields>({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  return (
    <Paper maw={400} miw={300} p="md" radius="md" withBorder>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput label="Email Address" {...form.getInputProps("email")} />
          <TextInput label="Name" {...form.getInputProps("name")} />
          <PasswordInput label="Password" {...form.getInputProps("password")} />
          <Button loading={loading} type="submit">
            Sign In
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
