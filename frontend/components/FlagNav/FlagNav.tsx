import type { FlowNode } from "@customTypes/nodeTypes";
import type { Edge } from "reactflow";

import { TextInput, NavLink } from "@mantine/core";
import Link from "next/link";
import { Search } from "tabler-icons-react";

export type Project = {
  id: string;
  name: string;
  flags: Flag[];
};

type Flag = {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: Edge[];
};

type Props = {
  projects: Project[];
};

export default function FlagNav({ projects }: Props) {
  return (
    <>
      <TextInput placeholder="Search for flags" icon={<Search size="1rem" />} mb="sm" />
      {projects.map(({ name, flags, id: projectId }) => (
        <NavLink key={name} label={name}>
          {flags.map(({ name, id: flagId }) => (
            <NavLink
              component={Link}
              href={["flags", projectId, flagId].join("/")}
              key={flagId}
              label={name}
            />
          ))}
        </NavLink>
      ))}
    </>
  );
}
