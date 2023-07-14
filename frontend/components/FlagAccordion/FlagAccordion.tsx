import type { FlowNode } from "@customTypes/nodeTypes";
import type { UserData } from "@hooks/flagRules";

import AttributesAccordion from "@components/FlagAccordion/AttributesAccordion";
import TestingAccordion from "@components/FlagAccordion/TestingAccordion";
import { Accordion } from "@mantine/core";

type Props = {
  node: FlowNode | null;
  onNodeUpdate: (node: FlowNode) => void;
  userData: UserData;
  onUserDataChange: (userData: UserData) => void;
};

export default function FlagAccordion({
  node,
  onNodeUpdate,
  userData,
  onUserDataChange,
}: Props) {
  return (
    <Accordion multiple defaultValue={["Testing"]}>
      <TestingAccordion
        userData={userData}
        onUserDataChange={onUserDataChange}
      />
      {node != null && (
        <AttributesAccordion node={node} onNodeUpdate={onNodeUpdate} />
      )}
    </Accordion>
  );
}
