import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import WorkspacePage from "./pages/WorkspacePage";
import ModelPage from "./pages/ModelPage";
import ModelTestPage from "./pages/ModelTestPage";
import RunsPage from "./pages/RunsPage";
import { getHealth, getLoadedModels, getMlModels, getModels, LoadedModel, ModelMetadata, releaseImageModel } from "./services/api";

type ApiState = "checking" | "online" | "offline";

function App() {
  const [apiState, setApiState] = useState<ApiState>("checking");
  const [models, setModels] = useState<ModelMetadata[]>([]);
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);

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

  useEffect(() => {
    let isActive = true;
    async function refreshLoadedModels() {
      try {
        const loaded = await getLoadedModels();
        if (isActive) setLoadedModels(loaded);
      } catch {
        if (isActive) setLoadedModels([]);
      }
    }

    void refreshLoadedModels();
    const intervalId = window.setInterval(refreshLoadedModels, 3000);
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  async function releaseLoadedModel(modelId: string, source: "cv" | "ml") {
    await releaseImageModel(modelId, source);
    setLoadedModels((current) => current.filter((model) => !(model.model_id === modelId && model.source === source)));
  }

  return (
    <AppShell apiState={apiState} loadedModels={loadedModels} onReleaseModel={releaseLoadedModel} models={models}>
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
