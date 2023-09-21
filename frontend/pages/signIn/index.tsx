import type { SignInFormFields } from "@components/SignInForm/SignInForm";

import SignInForm from "@components/SignInForm/SignInForm";
import { Box, Stack, Text } from "@mantine/core";
import { axios } from "@utils/axiosFactory";
import { Flag } from "tabler-icons-react";

export default function SignIn() {
  const handleSubmit = async (values: SignInFormFields) => {
    const response = await axios.post("/api/auth/login", values);

    console.log(response);
  };

  return (
    <Box style={{ height: "100%" }}>
      <Stack justify="center" align="center">
        <Flag size="3rem" />
        <Text size="xl">Sign In to Flags</Text>
        <Box>
          <SignInForm onSubmit={handleSubmit} />
        </Box>
      </Stack>
    </Box>
  );
}
