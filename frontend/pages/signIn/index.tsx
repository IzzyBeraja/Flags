import type { SignInFormFields } from "@components/SignInForm/SignInForm";

import SignInForm from "@components/SignInForm/SignInForm";
import { Box, Stack, Text } from "@mantine/core";
import { axios } from "@utils/axiosFactory";
import { useRouter } from "next/router";
import { useState } from "react";
import { Flag } from "tabler-icons-react";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: SignInFormFields) => {
    setIsLoading(true);
    const response = await axios.post("/api/auth/login", values);

    if (response.status === 200) router.push("/dashboard");
    //> TODO: handle 400 errors (validation errors)
    else setErrorMessage(response.data.message);

    setIsLoading(false);
  };

  return (
    <Box style={{ height: "100%" }}>
      <Stack justify="center" align="center">
        <Flag size="3rem" />
        <Text size="xl">Sign In to Flags</Text>
        <SignInForm onSubmit={handleSubmit} loading={isLoading} />
        {errorMessage && <Text color="red">{errorMessage}</Text>}
      </Stack>
    </Box>
  );
}
