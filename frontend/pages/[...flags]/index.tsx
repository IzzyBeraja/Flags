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

import { fakeProjects } from "@/data/fakedata";
import { useFlagResults } from "@/hooks/flagRules";
import { boolToStatus } from "@/util/typeConversions";

export default function FlagsRoute() {
  //? Routing
  const router = useRouter();
  const route = router.query["flags"] ?? [];
  const [_, projectId, flagId] = Array.isArray(route) ? route : [route];

  //? React Flow
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  //? Flag Results
  const [userData, setUserData, results] = useFlagResults({
    currentOS: null,
    dob: null,
    employee: null,
    tester: null,
    userId: null,
  });

  //= TODO: replace with real data queried either Server Side or Client Side
  const projects = fakeProjects;

  const currentProject = useMemo(
    () => projects.find(({ id }) => id === projectId),
    [projects, projectId]
  );
  const currentFlag = useMemo(
    () => currentProject?.flags.find(({ id }) => id === flagId),
    [currentProject, flagId]
  );

  //? When the route changes, update the nodes and edges
  useEffect(() => {
    setNodes(currentFlag?.nodes ?? []);
    setEdges(currentFlag?.edges ?? []);
  }, [route]);

  //? When userData changes, update the status of the nodes
  useEffect(() => {
    console.log("userData changed");
    setNodes(currNodes =>
      currNodes.map(node => {
        const ruleId = node.data.ruleId ?? "";
        const updatedNode = {
          ...node,
          data: { ...node.data, status: boolToStatus(results[ruleId]) },
        };

        return updatedNode;
      })
    );
  }, [userData]);

  const onNodesChangeHandler = useCallback(
    async (nodeChanges: NodeChange[]) => {
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
        ruleId: "",
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

  const onNodeUpdate = useCallback(
    (updatedNode: FlowNode) => {
      setNodes(currNodes =>
        currNodes.map(node => {
          if (node.id !== updatedNode.id) return node;

          const ruleId = updatedNode.data.ruleId ?? "";
          updatedNode.data.status = boolToStatus(results[ruleId]);

          return updatedNode;
        })
      );
    },
    [userData, setUserData, results]
  );

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
          userData={userData}
          onUserDataChange={setUserData}
          node={nodes.find(n => n.id === selectedNode) ?? null}
          onNodeUpdate={onNodeUpdate}
        />
      </Grid.Col>
    </Grid>
  );
}
