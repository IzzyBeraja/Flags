import { Button } from "@mantine/core";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Button href="/login" component={Link} variant="default">
      Login
    </Button>
  );
}
