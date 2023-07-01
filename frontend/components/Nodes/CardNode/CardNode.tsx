import type { Icon } from "tabler-icons-react";

import {
  ActionIcon,
  Card,
  Group,
  Text,
  Box,
  createStyles,
  rem,
} from "@mantine/core";
import { Handle, Position } from "reactflow";

export type Status = keyof typeof StatusColor;

enum StatusColor {
  pass,
  fail,
  error,
}

export type CardData = {
  label: string;
  icon?: Icon;
  status?: Status;
};

type Props = {
  data: CardData;
};

export default function CardNode({ data }: Props) {
  const { label, icon: Icon, status = "error" } = data;
  const { classes, cx } = useStyles();

  return (
    <Box>
      <Card
        shadow="sm"
        maw="15rem"
        className={cx(classes.container, classes[status])}
      >
        <Group position="center" spacing="sm">
          {Icon != null && (
            <ActionIcon variant="outline" color="green">
              <Icon />
            </ActionIcon>
          )}
          <Text weight={500}>{label}</Text>
        </Group>
      </Card>
      <Handle
        type="target"
        position={Position.Top}
        className={cx(classes.handle, classes.handleTop)}
      />
      <Handle
        className={cx(classes.handle, classes.handleBottom)}
        type="source"
        position={Position.Bottom}
      />
    </Box>
  );
}

const useStyles = createStyles(theme => ({
  container: {
    borderStyle: "solid",
    borderWidth: rem(1),
  },
  error: {
    borderColor: theme.colors.gray[4],
  },
  fail: {
    borderColor: theme.colors.red[6],
  },
  handle: {
    backgroundColor: "white",
    border: `${rem(2)} solid ${theme.colors.blue[7]}`,
    height: ".75rem",
    width: ".75rem",
  },
  handleBottom: {
    bottom: "-.375rem",
  },
  handleTop: {
    top: "-.375rem",
  },
  pass: {
    borderColor: theme.colors.green[6],
  },
}));
