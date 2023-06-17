import type { Icon } from "tabler-icons-react";

import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { Handle, Position } from "reactflow";

type Props = {
  data: {
    label: string;
    icon?: Icon;
  };
};

export default function FlagNode({ data }: Props) {
  return (
    <>
      <Card shadow="sm" withBorder maw="15rem">
        <Group position="center" spacing="sm">
          {data.icon != null && (
            <ActionIcon variant="outline" color="green">
              <data.icon />
            </ActionIcon>
          )}
          <Text weight={500}>{data.label}</Text>
        </Group>
      </Card>
      <Handle
        style={{
          borderColor: "grey",
          borderRadius: ".25rem",
          height: ".25rem",
          width: "1rem",
        }}
        type="target"
        position={Position.Top}
      />
      <Handle
        style={{
          borderColor: "grey",
          borderRadius: ".25rem",
          height: ".25rem",
          width: "1rem",
        }}
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}
