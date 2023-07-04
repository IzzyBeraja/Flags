import type { FlowNode } from "@customTypes/nodeTypes";

import { Accordion, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { TestPipe, Adjustments } from "tabler-icons-react";

type Attributes = {
  name: string;
  type: string;
  value: string;
};

type Props = {
  attributes?: Attributes;
  node: FlowNode | null;
  onNodeUpdate: (node: FlowNode) => void;
};

export default function FlagAccordion({
  attributes: _,
  node,
  onNodeUpdate,
}: Props) {
  const form = useForm({
    initialValues: {
      label: "",
    },
  });

  useEffect(() => {
    node == null ? form.reset() : form.setValues(node.data);
  }, [node]);

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
      {node != null && (
        <Accordion.Item value="Attributes">
          <Accordion.Control icon={<Adjustments size={"1.5rem"} />}>
            Attributes
          </Accordion.Control>
          <Accordion.Panel>
            <form>
              <TextInput
                label="Label"
                placeholder="Node label"
                {...form.getInputProps("label")}
                onChange={e =>
                  onNodeUpdate({
                    ...node,
                    data: { ...node.data, label: e.target.value },
                  })
                }
              />
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      )}
    </Accordion>
  );
}
