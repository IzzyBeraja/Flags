import type { FlowNode } from "@customTypes/nodeTypes";

import AttributesAccordion from "@components/FlagAccordion/AttributesAccordion";
import TestingAccordion from "@components/FlagAccordion/TestingAccordion";
import { Accordion } from "@mantine/core";

type Props = {
  node: FlowNode | null;
  onNodeUpdate: (node: FlowNode) => void;
};

export default function FlagAccordion({ node, onNodeUpdate }: Props) {
  return (
    <Accordion multiple defaultValue={["Testing"]}>
      <TestingAccordion />
      {node != null && (
        <AttributesAccordion node={node} onNodeUpdate={onNodeUpdate} />
      )}
    </Accordion>
  );
}
