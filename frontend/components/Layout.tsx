import Header from "./Header";
import SideBar from "./SideBar";

import { AppShell } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const links = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Flags", link: "/flags" },
  ];

  return (
    <AppShell header={<Header links={links} />} navbar={<SideBar />}>
      {children}
    </AppShell>
  );
}
