import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ApiState, LoadedModel, ModelMetadata } from "../services/api";

type TopbarProps = {
  apiState: ApiState;
  loadedModels: LoadedModel[];
  onReleaseModel: (modelId: string, source: "cv" | "ml") => Promise<void>;
  models: ModelMetadata[];
};

function Topbar({ apiState, loadedModels, onReleaseModel, models }: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [releasingModelId, setReleasingModelId] = useState<string | null>(null);
  const location = useLocation();
  const routeParts = location.pathname.split("/").filter(Boolean);
  const currentModel = routeParts[0] === "models" ? models.find((model) => model.id === routeParts[1]) : undefined;

  const breadcrumbs = [
    { label: "Workspace", to: "/" },
    ...(routeParts[0] === "models" ? [{ label: "Models", to: "/" }] : []),
    ...(currentModel ? [{ label: currentModel.name, to: `/models/${currentModel.id}` }] : []),
    ...(routeParts[2] === "test" ? [{ label: "Test", to: `/models/${currentModel?.id}/test` }] : []),
    ...(routeParts[0] === "runs" ? [{ label: "Runs", to: "/runs" }] : []),
  ];

  async function releaseModel(modelId: string) {
    setReleasingModelId(modelId);
    try {
      const model = loadedModels.find((item) => item.model_id === modelId);
      if (model) await onReleaseModel(modelId, model.source);
    } finally {
      setReleasingModelId(null);
    }
  }

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">AI / ML workspace</p>
        <h1>Model lab</h1>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => (
            <span className="breadcrumb-item" key={`${breadcrumb.label}-${index}`}>
              {index < breadcrumbs.length - 1 ? <Link to={breadcrumb.to}>{breadcrumb.label}</Link> : <span aria-current="page">{breadcrumb.label}</span>}
              {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator" aria-hidden="true">\</span>}
            </span>
          ))}
        </nav>
      </div>
      <div className="topbar-controls">
      <button className="topbar-meta loaded-models-toggle" type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        <span className={`status-dot status-dot-${apiState}`} />
        <span>Backend {apiState}</span>
        <span className="loaded-count">{loadedModels.length} loaded</span>
      </button>
      {isOpen && <div className="loaded-models-popover">
        <div className="loaded-models-heading"><strong>Runtime models</strong><span>{loadedModels.length} active</span></div>
        {loadedModels.length === 0 ? <p className="loaded-models-empty">No models are loaded.</p> : loadedModels.map((model) => (
          <div className="loaded-model-row" key={model.model_id}>
            <div><strong>{model.model_id}</strong><span>{model.source.toUpperCase()} / {model.device} · loaded {Math.round(model.load_time_ms)}ms</span></div>
            <button type="button" onClick={() => void releaseModel(model.model_id)} disabled={releasingModelId === model.model_id}>{releasingModelId === model.model_id ? "..." : "Release"}</button>
          </div>
        ))}
      </div>}
      </div>
    </header>
  );
}

export default Topbar;