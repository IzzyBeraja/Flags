"use client";

import {
  Container as M_Container,
  createStyles,
  Header as M_Header,
  Text as M_Text,
  Group as M_Group,
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
    <M_Header height={60}>
      <M_Container fluid className={classes.container}>
        <M_Text fz="xl">🚩 Flags</M_Text>
        <M_Group className={classes.links}>{linkElements}</M_Group>
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
