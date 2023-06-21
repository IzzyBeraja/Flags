import type { Icon } from "tabler-icons-react";

import { Box, Button } from "@mantine/core";
import { HandStop, Pointer, SquarePlus } from "tabler-icons-react";

type ActionBarItemValue = "move" | "new-node" | "pan";

type ActionBarItem = {
  icon: Icon;
  name: string;
  onClick: () => void;
  value: ActionBarItemValue;
};

type Props = {
  onAddNode: () => void;
  onPan: () => void;
  onMove: () => void;
  selected?: ActionBarItemValue;
};

export default function ActionBar({
  onAddNode,
  onPan,
  onMove,
  selected,
}: Props) {
  const items: ActionBarItem[] = [
    {
      icon: SquarePlus,
      name: "New Node",
      onClick: onAddNode,
      value: "new-node",
    },
    {
      icon: Pointer,
      name: "Move",
      onClick: onMove,
      value: "move",
    },
    {
      icon: HandStop,
      name: "Pan",
      onClick: onPan,
      value: "pan",
    },
  ];

  return (
    <Box mb="sm" display="flex">
      {items.map(({ icon: Icon, name, onClick, value }) => (
        <Button
          key={name}
          variant={selected === value ? "light" : "subtle"}
          leftIcon={<Icon />}
          onClick={onClick}
        >
          {name}
        </Button>
      ))}
    </Box>
  );
}
