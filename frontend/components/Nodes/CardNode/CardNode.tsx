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
  inputDisabled?: boolean;
  outputDisabled?: boolean;
  showHandles?: boolean;
};

type Props = {
  data: CardData;
  selected: boolean;
};

export default function CardNode({ data, selected }: Props) {
  const {
    label,
    icon: Icon,
    status = "error",
    inputDisabled = false,
    outputDisabled = false,
    showHandles = false,
  } = data;
  const { classes, cx } = useStyles();

  const displayHandles = showHandles || selected;

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
        className={cx(
          classes.handle,
          classes.handleTop,
          (inputDisabled || !displayHandles) && classes.handleDisabled
        )}
        isConnectable={!inputDisabled && displayHandles}
      />
      <Handle
        className={cx(
          classes.handle,
          classes.handleBottom,
          (outputDisabled || !displayHandles) && classes.handleDisabled
        )}
        type="source"
        position={Position.Bottom}
        isConnectable={!outputDisabled && displayHandles}
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
    backgroundColor: theme.colors.blue[7],
    border: `.01em solid ${theme.colors.gray[0]}`,
    height: ".5rem",
    width: ".5rem",
  },
  handleBottom: {
    bottom: "-.75rem",
  },
  handleDisabled: {
    cursor: "default !important", // Has to be important due to connectionIndicator specificity
    opacity: 0, // Can't use display none because react-flow determines edge position this way
  },
  handleTop: {
    top: "-.75rem",
  },
  pass: {
    borderColor: theme.colors.green[6],
  },
}));
