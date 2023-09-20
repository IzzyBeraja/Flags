import { Button } from "@mantine/core";
import Link from "next/link";

export default function SignInButton() {
  return (
    <Button href="/signIn" component={Link} variant="default">
      Sign In
    </Button>
  );
}
