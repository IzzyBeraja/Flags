"use client";

import {
  Container,
  Header as MantineHeader,
  createStyles,
  Text,
  Group,
} from "@mantine/core";
import Link from "next/link";

export type LinkType = { link: string; label: string };

type Props = {
  links: Array<LinkType>;
};

export default function Header({ links }: Props) {
  const { classes } = useStyles();

  const linkElements = links.map(({ link, label }) => (
    <Link key={label} href={link}>
      {label}
    </Link>
  ));

  return (
    <MantineHeader height={60}>
      <Container fluid className={classes.container}>
        <Text fz="xl">🚩 Flags</Text>
        <Group className={classes.links}>{linkElements}</Group>
      </Container>
    </MantineHeader>
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
