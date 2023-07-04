import type { ActionType } from "@components/ActionBar/ActionBar";
import type { FlowNode, CustomNodeTypes } from "@customTypes/nodeTypes";
import type {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  OnSelectionChangeParams,
} from "reactflow";

import ActionBar from "@components/ActionBar/ActionBar";
import CardNode from "@components/Nodes/CardNode/CardNode";
import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Panel,
  useReactFlow,
} from "reactflow";

type MoveType = "pan" | "move";

type Props = {
  nodes: FlowNode[];
  edges: Edge[];
  onNodesChange: (nodes: NodeChange[]) => void;
  onEdgesChange: (edges: EdgeChange[]) => void;
  onConnect: (connection: Edge | Connection) => void;
  onNewNode: () => void;
  onSelectionChange: (params: OnSelectionChangeParams) => void;
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
  onNewNode,
  onSelectionChange,
}: Props) {
  const { fitView } = useReactFlow();
  const [action, setAction] = useState<ActionType>("move");
  const [moveType, setMoveType] = useState<MoveType>("move");

  const nodeType = useMemo<CustomNodeTypes>(() => ({ card: CardNode }), []);

  const onNodesChangeHandler = useCallback((nodeChanges: NodeChange[]) => {
    onNodesChange(nodeChanges);
  }, []);
  const onEdgesChangeHandler = useCallback((edgeChanges: EdgeChange[]) => {
    onEdgesChange(edgeChanges);
  }, []);

  const onConnectHandler = useCallback((connection: Edge | Connection) => {
    onConnect(connection);
  }, []);

  const onMoveHandler = useCallback(() => {
    setMoveType("move");
    setAction("move");

    //! This is a hacky way to change cursor!
    //! Seems like only option with ReactFlow library
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cssProp: any = document.querySelector(":root");
    cssProp.style.setProperty("--pointer-option", "default");
  }, []);

  const onPaneHandler = useCallback(() => {
    setMoveType("pan");
    setAction("pan");

    //! This is a hacky way to change cursor!
    //! Seems like only option with ReactFlow library
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cssProp: any = document.querySelector(":root");
    cssProp.style.setProperty("--pointer-option", "grab");
  }, []);

  const onAddNodeHandler = useCallback(() => {
    onNewNode();
    setAction("newNode");
  }, []);

  const onFitViewHandler = useCallback(() => {
    fitView();
  }, [nodes, edges]);

  const onAddEdgeHandler = useCallback(() => {
    console.log("Add connection");
    setAction("newEdge");
  }, []);

  const onSelectionChangeHandler = useCallback(
    (selection: OnSelectionChangeParams) => {
      onSelectionChange(selection);
    },
    []
  );

  return (
    <>
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
        nodesDraggable={moveType === "move"}
        panOnDrag={moveType === "pan" || [1]}
        deleteKeyCode={["Delete", "Backspace"]}
        onSelectionChange={onSelectionChangeHandler}
      >
        <Panel position="bottom-center">
          <ActionBar
            onAddNode={onAddNodeHandler}
            onPan={onPaneHandler}
            onMove={onMoveHandler}
            onAddEdge={onAddEdgeHandler}
            onFitView={onFitViewHandler}
            selected={action}
          />
        </Panel>
        <Background color="#666" variant={BackgroundVariant.Dots} gap={40} />
      </ReactFlow>
    </>
  );
}
