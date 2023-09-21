import type { SignUpFormFields } from "@components/SignUpForm/SignUpForm";

import SignUpForm from "@components/SignUpForm/SignUpForm";
import { Box, Stack, Text } from "@mantine/core";
import { axios } from "@utils/axiosFactory";
import { useRouter } from "next/router";
import { useState } from "react";
import { Flag } from "tabler-icons-react";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: SignUpFormFields) => {
    setIsLoading(true);
    const response = await axios.post("/api/auth/register", values);

    //? Is this the best way to handle all my errors?
    if (response.status === 201) router.push("/dashboard");
    //> TODO: handle 400 errors (validation errors)
    else setErrorMessage(response.data.message);

    console.log(response.data);

    setIsLoading(false);
  };

  return (
    <Box style={{ height: "100%" }}>
      <Stack justify="center" align="center">
        <Flag size="3rem" />
        <Text size="xl">Welcome to Flags!</Text>
        <SignUpForm onSubmit={handleSubmit} loading={isLoading} />
        {errorMessage && <Text color="red">{errorMessage}</Text>}
      </Stack>
    </Box>
  );
}
