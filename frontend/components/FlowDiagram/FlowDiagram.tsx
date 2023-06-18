import "reactflow/dist/style.css";

import type { FlowNode, CustomNodeTypes, Flag } from "@customTypes/nodeTypes";
import type { Connection, Edge, EdgeChange, NodeChange } from "reactflow";

import CardNode from "@components/CardNode/CardNode";
import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";

type Props = {
  flags: Flag[];
  onNodesChange: (nodes: NodeChange[]) => void;
  onEdgesChange: (edges: EdgeChange[]) => void;
  onConnect: (connection: Edge | Connection) => void;
};

export default function FlowDiagram({
  onNodesChange,
  onEdgesChange,
  onConnect,
}: Props) {
  const nodeType = useMemo<CustomNodeTypes>(
    () => ({ card: CardNode, dropdown: CardNode }),
    []
  );

  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleNodesChange = useCallback(
    (nodeChanges: NodeChange[]) => {
      onNodesChange(nodeChanges);
      setNodes(newNodes => applyNodeChanges(nodeChanges, newNodes));
    },
    [setNodes]
  );
  const handleEdgesChange = useCallback(
    (edgeChanges: EdgeChange[]) => {
      onEdgesChange(edgeChanges);
      setEdges(newEdges => applyEdgeChanges(edgeChanges, newEdges));
    },
    [setEdges]
  );

  const handleConnect = useCallback(
    (connection: Edge | Connection) => {
      onConnect(connection);
      setEdges(eds => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <main style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeType}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        fitView
      >
        <Background color="#666" variant={BackgroundVariant.Dots} gap={40} />
        <Controls />
      </ReactFlow>
    </main>
  );
}

//? This is how the data needs to be structured after the node data is passed
//? I'll need to figure out how to set the positions for each of the nodes automatically
/**
 * const initialNodes: FlowNode[] = [
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
 */
