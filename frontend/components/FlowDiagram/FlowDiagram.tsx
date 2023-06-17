import "reactflow/dist/style.css";

import type { Connection, Edge } from "reactflow";
import type { Icon } from "tabler-icons-react";

import FlagNode from "@components/FlagNode/FlagNode";
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

type NodeData = {
  data: {
    icon?: Icon;
    label: string;
  };
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: string;
};

const initialNodes: NodeData[] = [
  {
    data: { label: "Start" },
    id: "1",
    position: { x: 50, y: 0 },
    type: "flagNode",
  },
  {
    data: {
      icon: BrandAndroid,
      label: "Device is Android",
    },
    id: "2",
    position: { x: 100, y: 150 },
    type: "flagNode",
  },
  {
    data: { icon: BrandApple, label: "Device is iOS" },
    id: "3",
    position: { x: -100, y: 150 },
    type: "flagNode",
  },
  {
    data: { icon: Rocket, label: "Launch Rocket" },
    id: "4",
    position: { x: 0, y: 300 },
    type: "flagNode",
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

  const nodeType = useMemo(() => ({ flagNode: FlagNode }), [initialNodes]);

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
