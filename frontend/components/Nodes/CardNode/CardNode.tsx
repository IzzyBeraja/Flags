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
};

export default function CardNode({ data }: Props) {
  const {
    label,
    icon: Icon,
    status = "error",
    inputDisabled = false,
    outputDisabled = false,
    showHandles = false,
  } = data;
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
        className={cx(
          classes.handle,
          classes.handleTop,
          (inputDisabled || !showHandles) && classes.handleDisabled
        )}
        isConnectable={!inputDisabled && showHandles}
      />
      <Handle
        className={cx(
          classes.handle,
          classes.handleBottom,
          (outputDisabled || !showHandles) && classes.handleDisabled
        )}
        type="source"
        position={Position.Bottom}
        isConnectable={!outputDisabled && showHandles}
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
    cursor: "wait",
  },
  handleDisabled: {
    cursor: "default !important", // Has to be important due to connectionIndicator specificity
    opacity: 0, // Can't use display none because react-flow determines edge position this way
  },
  handleTop: {
    top: "-.375rem",
  },
  pass: {
    borderColor: theme.colors.green[6],
  },
}));
