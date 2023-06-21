import type { Icon } from "tabler-icons-react";

import { Button, Card } from "@mantine/core";
import {
  ArrowGuide,
  HandStop,
  Maximize,
  Pointer,
  SquarePlus,
} from "tabler-icons-react";

export type ActionType = "move" | "newNode" | "pan" | "fit" | "newEdge";

type ActionBarItem = {
  icon: Icon;
  name: string;
  onClick: () => void;
  value: ActionType;
};

type Props = {
  onAddNode: () => void;
  onPan: () => void;
  onMove: () => void;
  onFitView: () => void;
  onAddEdge: () => void;
  selected?: ActionType;
  compact?: boolean;
};

export default function ActionBar({
  onAddNode,
  onPan,
  onMove,
  onFitView,
  onAddEdge,
  selected,
  compact = true,
}: Props) {
  const items: ActionBarItem[] = [
    {
      icon: SquarePlus,
      name: "New Node",
      onClick: onAddNode,
      value: "newNode",
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
      icon: ArrowGuide,
      name: "Connect",
      onClick: onAddEdge,
      value: "newEdge",
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
          leftIcon={!compact && <Icon size="1.5rem" />}
          onClick={onClick}
        >
          {compact ? <Icon size="1.5rem" /> : name}
        </Button>
      ))}
    </Card>
  );
}
