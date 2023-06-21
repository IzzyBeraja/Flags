import type { Icon } from "tabler-icons-react";

import { Button, Card } from "@mantine/core";
import { HandStop, Maximize, Pointer, SquarePlus } from "tabler-icons-react";

type ActionBarItemValue = "move" | "new-node" | "pan" | "fit";

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
  onFitView: () => void;
  selected?: ActionBarItemValue;
  compact?: boolean;
};

export default function ActionBar({
  onAddNode,
  onPan,
  onMove,
  onFitView,
  selected,
  compact,
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
    {
      icon: Maximize,
      name: "Fit View",
      onClick: onFitView,
      value: "fit",
    },
  ];

  return (
    <Card padding="xs" display="flex" radius="lg">
      {items.map(({ icon: Icon, name, onClick, value }) => (
        <Button
          key={name}
          radius="md"
          variant={selected === value ? "light" : "subtle"}
          leftIcon={compact || <Icon size="1.5rem" />}
          onClick={onClick}
        >
          {compact ? <Icon size="1.5rem" /> : name}
        </Button>
      ))}
    </Card>
  );
}
