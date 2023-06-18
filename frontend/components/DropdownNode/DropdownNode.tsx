import type { Icon } from "tabler-icons-react";

import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { Handle, Position } from "reactflow";

export type DropdownData = {
  label: string;
  icon?: Icon;
  options: string[];
};

type Props = {
  data: DropdownData;
};

export default function DropdownNode({ data }: Props) {
  const { label, icon: Icon } = data;

  return (
    <>
      <Card shadow="sm" withBorder maw="15rem">
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
