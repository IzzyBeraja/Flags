import NavBarItem from "@components/NavBarItem/NavBarItem";
import { Navbar as M_NavBar } from "@mantine/core";
import { ReportAnalytics } from "tabler-icons-react";

export default function SideBar() {
  return (
    <M_NavBar width={{ base: "15rem" }} p="md">
      <M_NavBar.Section grow>
        <NavBarItem
          label="Analytics"
          icon={ReportAnalytics}
          tooltip="Analytics"
          href="/"
        />
      </M_NavBar.Section>
      <M_NavBar.Section>User Information</M_NavBar.Section>
    </M_NavBar>
  );
}
