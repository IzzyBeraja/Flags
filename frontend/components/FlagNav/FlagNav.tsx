import { TextInput, NavLink } from "@mantine/core";
import { Search } from "tabler-icons-react";

export type Project = {
  name: string;
  flags: Flag[];
};

type Status = "pass" | "fail" | "error";

type Flag = {
  name: string;
  status: Status;
};

type Props = {
  projects: Project[];
};

export default function FlagNav({ projects }: Props) {
  return (
    <>
      <TextInput placeholder="Search for flags" icon={<Search size="1rem" />} />
      {projects.map(({ name, flags }) => (
        <NavLink key={name} label={name}>
          {flags.map(({ name }) => (
            <NavLink key={name} label={name} />
          ))}
        </NavLink>
      ))}
    </>
  );
}
