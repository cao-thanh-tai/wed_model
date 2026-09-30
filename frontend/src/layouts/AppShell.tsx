import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { ApiState, LoadedModel, ModelMetadata } from "../services/api";

type AppShellProps = {
  children: ReactNode;
  apiState: ApiState;
  loadedModels: LoadedModel[];
  onReleaseModel: (modelId: string, source: "cv" | "ml") => Promise<void>;
  models: ModelMetadata[];
};

function AppShell({ children, apiState, loadedModels, onReleaseModel, models }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Topbar apiState={apiState} loadedModels={loadedModels} onReleaseModel={onReleaseModel} models={models} />
        <main className="workspace">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;