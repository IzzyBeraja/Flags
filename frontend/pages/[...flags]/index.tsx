import type { Project } from "@components/FlagNav/FlagNav";
import type { FlowNode } from "@customTypes/nodeTypes";
import type {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  OnSelectionChangeParams,
} from "reactflow";

import FlagAccordion from "@components/FlagAccordion/FlagAccordion";
import FlagNav from "@components/FlagNav/FlagNav";
import FlowDiagram from "@components/FlowDiagram/FlowDiagram";
import { Grid } from "@mantine/core";
import { useCallback, useState } from "react";
import {
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";

const projects: Project[] = [
  {
    flags: [
      {
        edges: [],
        id: "flag1",
        name: "Launch Rocket",
        nodes: [],
      },
      {
        edges: [],
        id: "flag2",
        name: "Run Rover",
        nodes: [],
      },
      {
        edges: [],
        id: "flag3",
        name: "Invest in CGI",
        nodes: [],
      },
      {
        edges: [],
        id: "flag4",
        name: "Deal with Aliens",
        nodes: [],
      },
    ],
    id: "project1",
    name: "Development",
  },
  {
    flags: [
      {
        edges: [],
        id: "flag5",
        name: "Show Banner",
        nodes: [],
      },
      {
        edges: [],
        id: "flag6",
        name: "30 second ads",
        nodes: [],
      },
      {
        edges: [],
        id: "flag7",
        name: "Display Call to Action",
        nodes: [],
      },
    ],
    id: "project2",
    name: "Advertising",
  },
];

export default function FlagsRoute() {
  //> This will be the initial state of the flag
  //> Updates to the flag and flow will be separate so less data is passed around
  //> I need to understand better how to handle the state of the diagram
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const results: Record<string, boolean> = {
    node1: true,
    node2: false,
    node3: true,
    node4: false,
  };

  const onNodesChangeHandler = useCallback(
    (nodeChanges: NodeChange[]) => {
      setNodes(currNodes => applyNodeChanges(nodeChanges, currNodes));
    },
    [setNodes]
  );

  const onEdgesChangeHandler = useCallback(
    (edgeChanges: EdgeChange[]) => {
      setEdges(currEdges => applyEdgeChanges(edgeChanges, currEdges));
    },
    [setEdges]
  );

  const onConnectHandler = useCallback(
    (connection: Edge | Connection) => {
      setEdges(eds => addEdge(connection, eds));
    },
    [setEdges]
  );

  let num = 0;

  const onNewNode = useCallback(() => {
    const newNode: FlowNode = {
      data: {
        label: `Node ${num}`,
        status: results[`node${num}`] ? "pass" : "fail",
      },
      id: `node${num}`,
      position: { x: 0, y: 0 },
      type: "card",
    };
    num++;
    setNodes(currNodes => currNodes.concat(newNode));
  }, []);

  const onSelectionChange = useCallback(
    (selection: OnSelectionChangeParams) =>
      setSelectedNode(selection.nodes[0]?.id),
    []
  );

  const onNodeUpdate = useCallback((updatedNode: FlowNode) => {
    setNodes(currNodes =>
      currNodes.map(node => (node.id === updatedNode.id ? updatedNode : node))
    );
  }, []);

  return (
    <Grid style={{ height: "100%" }}>
      <Grid.Col span={2}>
        <FlagNav projects={projects} />
      </Grid.Col>
      <Grid.Col span="auto" display="flex" style={{ flexDirection: "column" }}>
        <ReactFlowProvider>
          <FlowDiagram
            nodes={nodes}
            edges={edges}
            onConnect={onConnectHandler}
            onNodesChange={onNodesChangeHandler}
            onEdgesChange={onEdgesChangeHandler}
            onNewNode={onNewNode}
            onSelectionChange={onSelectionChange}
          />
        </ReactFlowProvider>
      </Grid.Col>
      <Grid.Col span={2}>
        <FlagAccordion
          node={nodes.find(n => n.id === selectedNode) ?? null}
          onNodeUpdate={onNodeUpdate}
        />
      </Grid.Col>
    </Grid>
  );
}
