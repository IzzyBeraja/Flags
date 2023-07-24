import type { CardData } from "@components/Nodes/CardNode/CardNode";
import type { FlowNode } from "@customTypes/nodeTypes";
import type { FlagMap } from "@hooks/useFlagResults";

import { Accordion, Checkbox, Select, Stack, TextInput } from "@mantine/core";
import { useCallback, useState } from "react";
import { Adjustments } from "tabler-icons-react";

type Props = {
  node: FlowNode;
  onNodeUpdate: (node: FlowNode) => void;
  flagRules: FlagMap;
};

export default function AttributesAccordion({
  node,
  onNodeUpdate,
  flagRules,
}: Props) {
  const [currentRule, setCurrentRule] = useState<string | null>(
    node.data.ruleId ?? null
  );

  const updateNode = useCallback(
    <K extends keyof CardData>(key: K, value: CardData[K]) => {
      if (node == null) return;

      const newData = { ...node.data, [key]: value };
      onNodeUpdate({ ...node, data: newData });
    },
    [node, onNodeUpdate]
  );

  const updateRule = useCallback(
    (ruleId: string) => {
      setCurrentRule(ruleId);
      updateNode("label", flagRules?.get(ruleId)?.label ?? "");
      updateNode(
        "status",
        flagRules?.get(ruleId)?.result ?? false ? "pass" : "fail"
      );
      updateNode("ruleId", ruleId);
    },
    [updateNode]
  );

  return (
    <Accordion.Item value="Attributes">
      <Accordion.Control icon={<Adjustments size={"1.5rem"} />}>
        Attributes
      </Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <Select
            value={currentRule}
            onChange={updateRule}
            placeholder="Select a rule"
            label="Rule"
            searchable
            data={Array.from(flagRules.values())}
          />
          <TextInput
            label="Label"
            placeholder="Node label"
            value={flagRules?.get(currentRule ?? "")?.label ?? ""}
            onChange={e => updateNode("label", e.target.value)}
          />
          <Checkbox
            label="Status"
            disabled
            checked={flagRules?.get(currentRule ?? "")?.result ?? false}
            onChange={e =>
              updateNode("status", e.currentTarget.checked ? "pass" : "fail")
            }
          />
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
