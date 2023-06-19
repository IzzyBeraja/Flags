import { Accordion } from "@mantine/core";
import { TestPipe, Adjustments } from "tabler-icons-react";

type Attributes = {
  name: string;
  type: string;
  value: string;
};

type Props = {
  attributes?: Attributes;
};

export default function FlagAccordion({ attributes: _ }: Props) {
  return (
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
  );
}
