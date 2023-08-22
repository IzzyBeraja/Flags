import type { FlowNode } from "@customTypes/nodeTypes";
import type { Connection, Edge, EdgeChange, NodeChange, OnSelectionChangeParams } from "reactflow";

import FlagAccordion from "@components/FlagAccordion/FlagAccordion";
import FlagNav from "@components/FlagNav/FlagNav";
import FlowDiagram from "@components/FlowDiagram/FlowDiagram";
import { fakeProjects } from "@data/fakedata";
import { initialRules, useFlagResults } from "@hooks/useFlagResults";
import { Grid, useMantineTheme } from "@mantine/core";
import { boolToStatus } from "@util/typeConversions";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow } from "reactflow";

export default function FlagsRoute() {
  //? Routing
  const router = useRouter();
  const route = router.query["flags"] ?? [];
  const [_, projectId, flagId] = Array.isArray(route) ? route : [route];

  //? React Flow
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  //? Flag Results
  const [userData, setUserData, rules] = useFlagResults(
    {
      currentOS: null,
      dob: null,
      employee: null,
      tester: null,
      userId: null,
    },
    initialRules
  );

  const theme = useMantineTheme();

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

  //? When userData changes, update the status of the nodes and edges
  useEffect(() => {
    updateNodeStatuses();
    updateEdgeColors();
  }, [userData, currentFlag]);

  const updateNodeStatuses = useCallback(() => {
    setNodes(nodes =>
      nodes.map(node => {
        const ruleId = node.data.ruleId ?? "";
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            status: boolToStatus(rules.get(ruleId)?.result ?? false),
          },
        };
        return updatedNode;
      })
    );
  }, [userData, setUserData, rules]);

  const updateEdgeColors = useCallback(() => {
    setEdges(edges =>
      edges.map(edge => {
        boolToStatus(
          rules.get(reactFlowInstance.getNode(edge.source)?.data?.ruleId)?.result ?? false
        ) === "pass"
          ? ((edge.style = { stroke: theme.colors.green[3] }), (edge.animated = true))
          : ((edge.style = { stroke: theme.colors.red[3] }), (edge.animated = false));

        return edge;
      })
    );
  }, [userData, setUserData, rules]);

  // Gets called when the user interacts with a node
  const onNodesChangeHandler = useCallback(
    async (nodeChanges: NodeChange[]) => {
      setNodes(currNodes => applyNodeChanges(nodeChanges, currNodes));
    },
    [setNodes]
  );

  // Gets called when the user interacts with an edge
  const onEdgesChangeHandler = useCallback(
    (edgeChanges: EdgeChange[]) => {
      //? Update all edges when a connection is deleted

      setEdges(currEdges => applyEdgeChanges(edgeChanges, currEdges));
    },
    [setEdges]
  );

  // Gets called when the user connects two nodes
  const onConnectHandler = useCallback(
    (connection: Edge | Connection) => {
      //? Update all edges when a connection is added

      setEdges(eds => addEdge(connection, eds));
    },
    [setEdges]
  );

  let num = 0;

  const onNewNode = useCallback(() => {
    console.log("New node added");
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
    (selection: OnSelectionChangeParams) => setSelectedNode(selection.nodes[0]?.id),
    []
  );

  const onNodeUpdate = useCallback(
    (updatedNode: FlowNode) => {
      setNodes(currNodes =>
        currNodes.map(node => {
          if (node.id !== updatedNode.id) return node;

          const ruleId = updatedNode.data.ruleId ?? "";
          updatedNode.data.status = boolToStatus(rules.get(ruleId)?.result ?? false);

          return updatedNode;
        })
      );
    },
    [userData, setUserData, rules]
  );

  return (
    <Grid style={{ height: "100%" }}>
      <Grid.Col span={2}>
        <FlagNav projects={projects} />
      </Grid.Col>
      <Grid.Col span="auto" display="flex" style={{ flexDirection: "column" }}>
        <FlowDiagram
          nodes={nodes}
          edges={edges}
          onConnect={onConnectHandler}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChangeHandler}
          onNewNode={onNewNode}
          onSelectionChange={onSelectionChange}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <FlagAccordion
          flagRules={rules}
          userData={userData}
          onUserDataChange={setUserData}
          node={nodes.find(n => n.id === selectedNode) ?? null}
          onNodeUpdate={onNodeUpdate}
        />
      </Grid.Col>
    </Grid>
  );
}
