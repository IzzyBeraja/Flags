import ColorSchemeToggle from "../ColorSchemeToggle/ColorSchemeToggle";

import SignInButton from "@components/SignInButton/SignInButton";
import {
  Container as M_Container,
  createStyles,
  Header as M_Header,
  Text as M_Text,
  Group,
} from "@mantine/core";

export default function Header() {
  const { classes } = useStyles();

  return (
    <M_Header height={60}>
      <M_Container fluid className={classes.container}>
        <M_Text fz="xl">🚩 Flags</M_Text>
        <Group>
          <SignInButton />
          <ColorSchemeToggle />
        </Group>
      </M_Container>
    </M_Header>
  );
}

const useStyles = createStyles(theme => ({
  container: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
  },
  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
}));
