import type { CardData } from "@components/Nodes/CardNode/CardNode";
import type { DropdownData } from "@components/Nodes/DropdownNode/DropdownNode";
import type { ComponentType } from "react";
import type { Node, NodeProps } from "reactflow";

export enum FlowNodeType {
  Start = "start",
  End = "end",
  Card = "card",
  Dropdown = "dropdown",
}

export type Flag = {
  id: string;
} & FlagData;

export type FlagData =
  | { type: FlowNodeType.Start }
  | { type: FlowNodeType.End }
  | { data: CardData; type: FlowNodeType.Card }
  | { data: DropdownData; type: FlowNodeType.Dropdown };

export type FlowNode =
  | Node<CardData> // Default Node type
  | Node<{ label: "Start" }, FlowNodeType.Start> //> Needs custom component
  | Node<{ label: "End" }, FlowNodeType.End> //> Needs custom component
  | Node<CardData, FlowNodeType.Card>
  | Node<DropdownData, FlowNodeType.Dropdown>;

export type CustomNodeTypes = Record<
  Uncapitalize<keyof typeof FlowNodeType>,
  ComponentType<NodeProps>
>;
