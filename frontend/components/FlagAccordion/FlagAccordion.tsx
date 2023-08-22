import type { FlowNode } from "@customTypes/nodeTypes";
import type { FlagMap, UserData } from "@hooks/useFlagResults";

import AttributesAccordion from "@components/FlagAccordion/AttributesAccordion";
import TestingAccordion from "@components/FlagAccordion/TestingAccordion";
import { Accordion } from "@mantine/core";

type Props = {
  node: FlowNode | null;
  onNodeUpdate: (node: FlowNode) => void;
  userData: UserData;
  onUserDataChange: (userData: UserData) => void;
  flagRules: FlagMap;
};

export default function FlagAccordion({
  node,
  onNodeUpdate,
  userData,
  onUserDataChange,
  flagRules,
}: Props) {
  return (
    <Accordion multiple defaultValue={["Testing"]}>
      <TestingAccordion userData={userData} onUserDataChange={onUserDataChange} />
      {node != null && (
        <AttributesAccordion flagRules={flagRules} node={node} onNodeUpdate={onNodeUpdate} />
      )}
    </Accordion>
  );
}
