import type { Icon } from "tabler-icons-react";

import {
  Text as M_Text,
  Tooltip as M_Tooltip,
  Button as M_Button,
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
  return (
    <M_Tooltip openDelay={500} label={tooltip}>
      <M_Button
        component={Link}
        href={href}
        color="gray"
        variant="subtle"
        fullWidth
        leftIcon={<Icon size="1.5rem" />}
      >
        <M_Text>{label}</M_Text>
      </M_Button>
    </M_Tooltip>
  );
}
