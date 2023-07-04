import type { CardData } from "@components/Nodes/CardNode/CardNode";
import type { ComponentType } from "react";
import type { Node, NodeProps } from "reactflow";

export enum FlowNodeType {
  Card = "card",
}

export type Flag = {
  id: string;
} & FlagData;

export type FlagData = { data: CardData; type: FlowNodeType.Card };

export type FlowNode = Node<CardData>; // Default Node type

export type CustomNodeTypes = Record<
  Uncapitalize<keyof typeof FlowNodeType>,
  ComponentType<NodeProps>
>;
