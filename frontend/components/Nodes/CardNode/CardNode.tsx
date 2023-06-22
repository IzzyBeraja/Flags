import type { Icon } from "tabler-icons-react";

import {
  ActionIcon,
  Card,
  Group,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export type Status = "pass" | "fail" | "error";

export type CardData = {
  label: string;
  icon?: Icon;
  status?: Status;
};

type Props = {
  data: CardData;
  selected?: boolean;
  showHandles?: boolean;
};

export default function CardNode({ data, selected, showHandles }: Props) {
  const { label, icon: Icon, status = "error" } = data;
  const theme = useMantineTheme();

  const getColor = useCallback(
    (status: Status) => {
      if (selected) return theme.colors.blue[7];

      switch (status) {
        case "pass":
          return theme.colors.green[6];
        case "fail":
          return theme.colors.red[6];
        case "error":
          return theme.colors.gray[4];
      }
    },
    [theme, selected]
  );

  return (
    <div>
      <Card
        shadow="sm"
        maw="15rem"
        sx={() => ({ border: `${rem(1)} solid ${getColor(status)}` })}
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
      {showHandles && (
        <>
          <Handle
            style={{
              backgroundColor: "white",
              border: `${rem(2)} solid ${theme.colors.blue[7]}`,
              height: ".75rem",
              left: "calc(50%)",
              top: "calc(0% - .375rem)",
              width: ".75rem",
            }}
            type="target"
            position={Position.Top}
          />
          <Handle
            style={{
              backgroundColor: "white",
              border: `${rem(2)} solid ${theme.colors.blue[7]}`,
              height: ".75rem",
              left: "calc(50%)",
              top: "calc(100% - .375rem)",
              width: ".75rem",
            }}
            type="source"
            position={Position.Bottom}
          />
        </>
      )}
    </div>
  );
}
