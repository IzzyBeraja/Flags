import type { FlagData } from "@components/FlagItem";

import FlagList from "@components/FlagList";
import { Navbar as M_NavBar } from "@mantine/core";

export default function SideBar() {
  const flags: Array<FlagData> = [
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
    <M_NavBar width={{ base: "15rem" }} p="md">
      <M_NavBar.Section grow>
        <FlagList flags={flags} />
      </M_NavBar.Section>
      <M_NavBar.Section>User Information</M_NavBar.Section>
    </M_NavBar>
  );
}
