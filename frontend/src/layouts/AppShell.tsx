import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

type AppShellProps = {
  children: ReactNode;
};

function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Topbar />
        <main className="workspace">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;