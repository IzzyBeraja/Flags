"use client";

import {
  Container,
  Header as MantineHeader,
  createStyles,
  Text,
  Group,
} from "@mantine/core";
import Link from "next/link";

type Props = {
  links: Array<{ link: string; label: string }>;
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
      <Container className={classes.container}>
        <Text fz="xl">Flags Logo</Text>
        <Group>{linkElements}</Group>
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
