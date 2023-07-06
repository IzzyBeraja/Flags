import type { CardData } from "@components/Nodes/CardNode/CardNode";
import type { FlowNode } from "@customTypes/nodeTypes";

import { Accordion, Checkbox, Stack, TextInput } from "@mantine/core";
import { useCallback } from "react";
import { Adjustments } from "tabler-icons-react";

type Props = {
  node: FlowNode;
  onNodeUpdate: (node: FlowNode) => void;
};

export default function AttributesAccordion({ node, onNodeUpdate }: Props) {
  const updateNode = useCallback(
    <K extends keyof CardData>(key: K, value: CardData[K]) => {
      if (node == null) return;

      const newData = { ...node.data, [key]: value };
      onNodeUpdate({ ...node, data: newData });
    },
    [node, onNodeUpdate]
  );

  return (
    <Accordion.Item value="Attributes">
      <Accordion.Control icon={<Adjustments size={"1.5rem"} />}>
        Attributes
      </Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <TextInput
            label="Label"
            placeholder="Node label"
            value={node.data.label ?? ""}
            onChange={e => updateNode("label", e.target.value)}
          />
          <Checkbox
            label="Status"
            disabled
            checked={node.data.status === "pass"}
            onChange={e =>
              updateNode("status", e.currentTarget.checked ? "pass" : "fail")
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
  );
}
