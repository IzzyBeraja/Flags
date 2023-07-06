import type { CardData } from "@components/Nodes/CardNode/CardNode";
import type { FlowNode } from "@customTypes/nodeTypes";

import { Accordion, Checkbox, Stack, TextInput } from "@mantine/core";
import { useCallback } from "react";
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
  const updateNode = useCallback(
    <K extends keyof CardData>(key: K, value: CardData[K]) => {
      if (node == null) return;

      const newData = { ...node?.data, [key]: value };
      onNodeUpdate({ ...node, data: newData });
    },
    [node, onNodeUpdate]
  );

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
            <Stack>
              <TextInput
                label="Label"
                placeholder="Node label"
                value={node.data.label}
                onChange={e => updateNode("label", e.target.value)}
              />
              <Checkbox
                label="Status"
                disabled
                checked={node.data.status === "pass"}
                onChange={e =>
                  updateNode(
                    "status",
                    e.currentTarget.checked ? "pass" : "fail"
                  )
                }
              />
              <TextInput
                label="Rule"
                placeholder="Rule Id"
                value={node.data.ruleId ?? ""}
                onChange={e => updateNode("ruleId", e.target.value)}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      )}
    </Accordion>
  );
}
