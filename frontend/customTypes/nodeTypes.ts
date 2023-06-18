import type { CardData } from "@components/CardNode/CardNode";
import type { DropdownData } from "@components/DropdownNode/DropdownNode";
import type { ComponentType } from "react";
import type { Node, NodeProps } from "reactflow";

export enum FlowNodeType {
  Card = "card",
  Dropdown = "dropdown",
}

export type FlowNode =
  | Node<CardData, FlowNodeType.Card>
  | Node<DropdownData, FlowNodeType.Dropdown>;

export type CustomNodeTypes = Record<
  Uncapitalize<keyof typeof FlowNodeType>,
  ComponentType<NodeProps>
>;
