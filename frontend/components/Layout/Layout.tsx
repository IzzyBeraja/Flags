import Header from "@components/Header/Header";
import NavBar from "@components/NavBar/NavBar";
import { AppShell as M_AppShell } from "@mantine/core";

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
    <M_AppShell header={<Header links={links} />} navbar={<NavBar />}>
      {children}
    </M_AppShell>
  );
}
