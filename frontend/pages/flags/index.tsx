import FlowDiagram from "@components/FlowDiagram/FlowDiagram";
import { Accordion, Grid, NavLink, TextInput } from "@mantine/core";
import { Adjustments, Check, Search, TestPipe, X } from "tabler-icons-react";

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
  return (
    <Grid style={{ height: "100%" }}>
      <Grid.Col span={2}>
        <TextInput
          placeholder="Search for flags"
          icon={<Search size="1rem" />}
        />
        {projects.map(({ name, flags }) => (
          <NavLink key={name} label={name}>
            {flags.map(({ name, status }) => (
              <NavLink
                key={name}
                label={name}
                icon={
                  status === "pass" ? (
                    <Check size="1rem" color={"green"} />
                  ) : (
                    <X size="1rem" color={"red"} />
                  )
                }
              />
            ))}
          </NavLink>
        ))}
      </Grid.Col>
      <Grid.Col span="auto">
        <FlowDiagram />
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
