import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import WorkspacePage from "./pages/WorkspacePage";
import ModelPage from "./pages/ModelPage";
import ModelTestPage from "./pages/ModelTestPage";
import RunsPage from "./pages/RunsPage";
import { getHealth, getMlModels, getModels, ModelMetadata } from "./services/api";

type ApiState = "checking" | "online" | "offline";

function App() {
  const [apiState, setApiState] = useState<ApiState>("checking");
  const [models, setModels] = useState<ModelMetadata[]>([]);

  useEffect(() => {
    Promise.allSettled([getHealth(), getModels(), getMlModels()])
      .then(([healthResult, cvResult, mlResult]) => {
        const cvModels = cvResult.status === "fulfilled" ? cvResult.value : [];
        const mlModels = mlResult.status === "fulfilled" ? mlResult.value : [];
        setModels([
          ...cvModels.map((model) => ({ ...model, source: "cv" as const })),
          ...mlModels.map((model) => ({ ...model, source: "ml" as const })),
        ]);
        setApiState(healthResult.status === "fulfilled" || cvModels.length > 0 || mlModels.length > 0 ? "online" : "offline");
      })
      .catch(() => setApiState("offline"));
  }, []);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<WorkspacePage apiState={apiState} models={models} />} />
        <Route path="/models/:modelId" element={<ModelPage apiState={apiState} models={models} />} />
        <Route path="/models/:modelId/test" element={<ModelTestPage apiState={apiState} models={models} />} />
        <Route path="/runs" element={<RunsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
