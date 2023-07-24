import Header from "@components/Header/Header";
import NavBar from "@components/NavBar/NavBar";
import { AppShell as M_AppShell } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactFlowProvider } from "reactflow";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const route = useRouter();
  const showNav = route.pathname !== "/";

  return (
    <M_AppShell header={<Header />} navbar={showNav ? <NavBar /> : <></>}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </M_AppShell>
  );
}
