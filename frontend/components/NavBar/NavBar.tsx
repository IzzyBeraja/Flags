import NavBarItem from "@components/NavBarItem/NavBarItem";
import { Navbar as M_NavBar } from "@mantine/core";
import {
  Bug,
  CircuitSwitchOpen,
  Flag,
  LayoutDashboard,
  ReportAnalytics,
  Settings,
} from "tabler-icons-react";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    tooltip: "Dashboard",
  },
  {
    href: "/analytics",
    icon: ReportAnalytics,
    label: "Analytics",
    tooltip: "Analytics",
  },
  {
    href: "/flags",
    icon: Flag,
    label: "Flags",
    tooltip: "Flags",
  },
  {
    href: "/killswitches",
    icon: CircuitSwitchOpen,
    label: "Kill Switches",
    tooltip: "Kill Switches",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    tooltip: "Settings",
  },
  {
    href: "/bugreport",
    icon: Bug,
    label: "Bug Report",
    tooltip: "Bug Report",
  },
];

export default function SideBar() {
  return (
    <M_NavBar width={{ base: "15rem" }} p="md">
      <M_NavBar.Section grow>
        {navItems.map(({ label, href, icon, tooltip }) => (
          <NavBarItem label={label} icon={icon} tooltip={tooltip} href={href} />
        ))}
      </M_NavBar.Section>
      <M_NavBar.Section>User Information</M_NavBar.Section>
    </M_NavBar>
  );
}
