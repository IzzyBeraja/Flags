import { Navbar as M_NavBar, NavLink, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
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
  },
  {
    href: "/analytics",
    icon: ReportAnalytics,
    label: "Analytics",
  },
  {
    href: "/flags",
    icon: Flag,
    label: "Flags",
  },
  {
    href: "/killswitches",
    icon: CircuitSwitchOpen,
    label: "Kill Switches",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
  {
    href: "/bugreport",
    icon: Bug,
    label: "Bug Report",
  },
];

export default function SideBar() {
  const { pathname } = useRouter();
  const theme = useMantineTheme();

  return (
    <M_NavBar width={{ base: "15rem" }} p="md">
      <M_NavBar.Section grow>
        {navItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={label}
            label={label}
            component={Link}
            href={href}
            color={theme.colorScheme === "dark" ? "gray" : "blue"}
            active={pathname === href}
            icon={<Icon size="1.5rem" strokeWidth={1} />}
          />
        ))}
      </M_NavBar.Section>
      <M_NavBar.Section>User Information</M_NavBar.Section>
    </M_NavBar>
  );
}
