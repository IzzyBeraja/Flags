import type { Icon } from "tabler-icons-react";

import {
  Text as M_Text,
  Tooltip as M_Tooltip,
  Button as M_Button,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";

type Props = {
  icon: Icon;
  label: string;
  href: string;
  tooltip: string;
};

export default function NavBarItem({
  label,
  icon: Icon,
  tooltip,
  href,
}: Props) {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  return (
    <M_Tooltip openDelay={500} label={tooltip}>
      <M_Button
        component={Link}
        href={href}
        variant="subtle"
        fullWidth
        color={theme.colorScheme === "dark" ? "gray" : "indigo"}
        leftIcon={<Icon size="1.5rem" />}
        classNames={{ inner: classes.inner }}
      >
        <M_Text>{label}</M_Text>
      </M_Button>
    </M_Tooltip>
  );
}

const useStyles = createStyles(() => ({
  inner: {
    justifyContent: "flex-start",
  },
}));
