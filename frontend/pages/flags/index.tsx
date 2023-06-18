import type { Flag } from "@customTypes/nodeTypes";
import type { Connection, Edge, EdgeChange, NodeChange } from "reactflow";

import FlowDiagram from "@components/FlowDiagram/FlowDiagram";
import { Accordion, Grid, NavLink, TextInput } from "@mantine/core";
import { useCallback, useState } from "react";
import { Adjustments, Search, TestPipe } from "tabler-icons-react";

const projects = [
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
  const [currentFlag, _setcurrentFlag] = useState<Flag[]>([]);

  const onNodesChange = useCallback(
    (nodeChanges: NodeChange[]) => console.log(nodeChanges),
    []
  );
  const onEdgesChange = useCallback(
    (edgeChanges: EdgeChange[]) => console.log(edgeChanges),
    []
  );

  const onConnect = useCallback(
    (connection: Edge | Connection) => console.log(connection),
    []
  );

  return (
    <Grid style={{ height: "100%" }}>
      <Grid.Col span={2}>
        <TextInput
          placeholder="Search for flags"
          icon={<Search size="1rem" />}
        />
        {projects.map(({ name, flags }) => (
          <NavLink key={name} label={name}>
            {flags.map(({ name }) => (
              <NavLink key={name} label={name} />
            ))}
          </NavLink>
        ))}
      </Grid.Col>
      <Grid.Col span="auto">
        <FlowDiagram
          flags={currentFlag}
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
