import type { Connection, Edge } from "reactflow";

import { useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { data: { label: "1" }, id: "1", position: { x: 0, y: 0 } },
  { data: { label: "2" }, id: "2", position: { x: 0, y: 100 } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", type: "step" }];

export default function FlowDiagram() {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges(edgeArr =>
        addEdge(
          { ...connection, animated: true, style: { color: "green" } },
          edgeArr
        )
      ),
    [setEdges]
  );

  return (
    <main style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
