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
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
        nodes: [
          {
            data: {
              label: "Is Android",
            },
            id: "node1",
            position: { x: 250, y: 5 },
            type: "card",
          },
        ],
      },
      {
        edges: [],
        id: "flag2",
        name: "Run Rover",
        nodes: [
          {
            data: {
              label: "Is Employee",
            },
            id: "node0",
            position: { x: 100, y: 4 },
            type: "card",
          },
          {
            data: {
              label: "Is Tester",
            },
            id: "node1",
            position: { x: 200, y: 4 },
            type: "card",
          },
        ],
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
  const router = useRouter();
  const route = router.query["flags"] ?? [];
  const [_, projectId, flagId] = Array.isArray(route) ? route : [route];

  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const currentProject = useMemo(
    () => projects.find(({ id }) => id === projectId),
    [projectId]
  );
  const currentFlag = useMemo(
    () => currentProject?.flags.find(({ id }) => id === flagId),
    [flagId]
  );

  useEffect(() => {
    setNodes(currentFlag?.nodes ?? []);
    setEdges(currentFlag?.edges ?? []);
  }, [route]);

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
