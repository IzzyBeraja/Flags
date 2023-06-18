import "reactflow/dist/style.css";

import type { FlowNode, CustomNodeTypes } from "@customTypes/nodeTypes";
import type { Connection, Edge } from "reactflow";

import CardNode from "@components/CardNode/CardNode";
import { FlowNodeType } from "@customTypes/nodeTypes";
import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { BrandAndroid, BrandApple, Rocket } from "tabler-icons-react";

const initialNodes: FlowNode[] = [
  {
    data: { label: "Start", options: ["Android", "iOS"] },
    id: "1",
    position: { x: 50, y: 0 },
    type: FlowNodeType.Dropdown,
  },
  {
    data: {
      icon: BrandAndroid,
      label: "Device is Android",
    },
    id: "2",
    position: { x: 100, y: 150 },
    type: FlowNodeType.Card,
  },
  {
    data: { icon: BrandApple, label: "Device is iOS" },
    id: "3",
    position: { x: -100, y: 150 },
    type: FlowNodeType.Card,
  },
  {
    data: { icon: Rocket, label: "Launch Rocket" },
    id: "4",
    position: { x: 0, y: 300 },
    type: FlowNodeType.Card,
  },
];
const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "step" },
  { id: "e1-3", source: "1", target: "3", type: "step" },
];

export default function FlowDiagram() {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges(edgeArr => addEdge({ ...connection, animated: true }, edgeArr)),
    [setEdges]
  );

  const nodeType = useMemo<CustomNodeTypes>(
    () => ({ card: CardNode, dropdown: CardNode }),
    [initialNodes]
  );

  return (
    <main style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeType}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#666" variant={BackgroundVariant.Dots} gap={40} />
        <Controls />
      </ReactFlow>
    </main>
  );
}
