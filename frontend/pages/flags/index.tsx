import type { Project } from "@components/FlagNav/FlagNav";
import type { FlowNode } from "@customTypes/nodeTypes";

import FlagNav from "@components/FlagNav/FlagNav";
import FlowDiagram from "@components/FlowDiagram/FlowDiagram";
import { Accordion, Grid } from "@mantine/core";
import { useCallback, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from "reactflow";
import { Adjustments, TestPipe } from "tabler-icons-react";

const projects: Project[] = [
  {
    flags: [
      {
        name: "Launch Rocket",
        status: "pass",
      },
      {
        name: "Run Rover",
        status: "pass",
      },
      {
        name: "Invest in CGI",
        status: "fail",
      },
      {
        name: "Deal with Aliens",
        status: "error",
      },
    ],
    name: "Development",
  },
  {
    flags: [
      {
        name: "Show Banner",
        status: "fail",
      },
      {
        name: "30 second ads",
        status: "fail",
      },
      {
        name: "Display Call to Action",
        status: "pass",
      },
    ],
    name: "Advertising",
  },
];

export default function Home() {
  //> This will be the initial state of the flag
  //> Updates to the flag and flow will be separate so less data is passed around
  //> I need to understand better how to handle the state of the diagram
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (nodeChanges: NodeChange[]) => {
      setNodes(currNodes => applyNodeChanges(nodeChanges, currNodes));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (edgeChanges: EdgeChange[]) => {
      setEdges(currEdges => applyEdgeChanges(edgeChanges, currEdges));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      setEdges(eds => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <Grid style={{ height: "100%" }}>
      <Grid.Col span={2}>
        <FlagNav projects={projects} />
      </Grid.Col>
      <Grid.Col span="auto">
        <FlowDiagram
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <Accordion multiple defaultValue={["Testing"]}>
          <Accordion.Item value="Testing">
            <Accordion.Control icon={<TestPipe size={"1.5rem"} />}>
              Testing
            </Accordion.Control>
            <Accordion.Panel>
              This section contains a form that allows for testing of the entire
              flow
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Attributes">
            <Accordion.Control icon={<Adjustments size={"1.5rem"} />}>
              Attributes
            </Accordion.Control>
            <Accordion.Panel>
              This section contains a form that allows for the creation of
              attributes
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Grid.Col>
    </Grid>
  );
}
