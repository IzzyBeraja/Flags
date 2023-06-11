import type { FlagType } from "./FlagItem";

import FlagList from "./FlagList";

import { Navbar } from "@mantine/core";

export default function SideBar() {
  const flags: Array<FlagType> = [
    {
      description: "flag1 description",
      id: "1",
      name: "flag1",
      status: "pass",
    },
    {
      description: "flag2 description",
      id: "2",
      name: "flag2",
      status: "fail",
    },
    {
      description: "flag3 description",
      id: "3",
      name: "flag3",
      status: "disabled",
    },
  ];

  return (
    <Navbar width={{ base: "12rem" }} p="md">
      <FlagList flags={flags} />
    </Navbar>
  );
}
