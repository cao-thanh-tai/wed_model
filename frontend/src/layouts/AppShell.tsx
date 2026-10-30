import { ReactNode, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { ApiState, LoadedModel, ModelMetadata } from "../services/api";

type AppShellProps = {
  children: ReactNode;
  apiState: ApiState;
  loadedModels: LoadedModel[];
  onReleaseModel: (modelId: string, source: "onnx") => Promise<void>;
  models: ModelMetadata[];
  modelSearch: string;
  onModelSearchChange: (value: string) => void;
};

function AppShell({ children, apiState, loadedModels, onReleaseModel, models, modelSearch, onModelSearchChange }: AppShellProps) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 8 || currentScrollY < lastScrollY.current) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsHeaderVisible(false);
      }

      lastScrollY.current = currentScrollY;
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar isVisible={isHeaderVisible} models={models} search={modelSearch} onSearchChange={onModelSearchChange} />
      <div className="app-content">
        <Topbar
          apiState={apiState}
          loadedModels={loadedModels}
          onReleaseModel={onReleaseModel}
          models={models}
          isVisible={isHeaderVisible}
        />
        <main className="workspace">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;