import "reactflow/dist/style.css";

import type { FlowNode, CustomNodeTypes } from "@customTypes/nodeTypes";
import type { Connection, Edge, EdgeChange, NodeChange } from "reactflow";

import CardNode from "@components/CardNode/CardNode";
import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
} from "reactflow";

type Props = {
  nodes: FlowNode[];
  edges: Edge[];
  onNodesChange: (nodes: NodeChange[]) => void;
  onEdgesChange: (edges: EdgeChange[]) => void;
  onConnect: (connection: Edge | Connection) => void;
};

//? How will I be handling the coloring of the nodes and edges?
//? Will this component be responsible for that? I'd need to pass in the flag data
//? If I color it here, I may have to set edges and nodes twice, once in parent, then here
export default function FlowDiagram({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: Props) {
  const nodeType = useMemo<CustomNodeTypes>(
    () => ({
      card: CardNode,
      dropdown: CardNode,
      end: CardNode, //> Needs custom component
      start: CardNode, //> Needs custom component
    }),
    []
  );

  const onNodesChangeHandler = useCallback((nodeChanges: NodeChange[]) => {
    onNodesChange(nodeChanges);
  }, []);
  const onEdgesChangeHandler = useCallback((edgeChanges: EdgeChange[]) => {
    onEdgesChange(edgeChanges);
  }, []);

  const onConnectHandler = useCallback((connection: Edge | Connection) => {
    onConnect(connection);
  }, []);

  return (
    <main style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeType}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnectHandler}
        nodeOrigin={[0.5, 0.5]} // Defines anchor point (0,0) is top left, (1,1) is bottom right, (0.5,0.5) is center
        fitView
        snapToGrid
        snapGrid={[4, 4]}
        defaultEdgeOptions={{ type: "step" }}
        connectionLineType={ConnectionLineType.Step}
        deleteKeyCode={["Delete", "Backspace"]}
      >
        <Background color="#666" variant={BackgroundVariant.Dots} gap={40} />
        <Controls />
      </ReactFlow>
    </main>
  );
}
