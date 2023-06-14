import Header from "@components/Header/Header";
import NavBar from "@components/NavBar/NavBar";
import { AppShell as M_AppShell } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <M_AppShell header={<Header />} navbar={<NavBar />}>
      {children}
    </M_AppShell>
  );
}
