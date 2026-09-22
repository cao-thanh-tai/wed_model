import { Link } from "react-router-dom";
import { ApiState, ModelMetadata } from "../services/api";

type WorkspacePageProps = {
  apiState: ApiState;
  models: ModelMetadata[];
};

const plannedModels = [
  { name: "Object Detection", category: "Computer Vision", input: "image", number: "02" },
  { name: "Image Segmentation", category: "Computer Vision", input: "image", number: "03" },
  { name: "Text Classification", category: "Natural Language", input: "text", number: "04" },
];

function WorkspacePage({ apiState, models }: WorkspacePageProps) {
  return (
    <section className="workspace-page" aria-labelledby="workspace-title">
      <div className="workspace-intro">
        <p className="eyebrow">Workspace</p>
        <h2 id="workspace-title">Put your models to work.</h2>
        <p className="intro-copy">
          Choose a model, give it an input, and see what it finds.
        </p>
      </div>

      <div className="workspace-status">
        <span className={`status-dot status-dot-${apiState}`} />
        <span>Backend {apiState}</span>
        <span className="status-divider" />
        <span>{models.length} model{models.length === 1 ? "" : "s"} available</span>
      </div>

      {models.length === 0 && apiState !== "checking" && (
        <div className="empty-state">No models are available right now.</div>
      )}

      <div className="catalogue-grid" aria-label="Available models">
        {models.map((model, index) => (
          <Link
            className="model-card"
            key={model.id}
            to={`/models/${model.id}`}
          >
            <div className={`model-card-visual model-card-visual-${index % 3}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="visual-frame" />
            </div>
            <div className="model-card-body">
              <div className="model-card-meta">
                <span>{model.category}</span>
                <span>{model.input_type}</span>
              </div>
              <h3>{model.name}</h3>
              <p>{model.description}</p>
              <span className="open-model">View model details <span aria-hidden="true">-&gt;</span></span>
            </div>
          </Link>
        ))}

        {plannedModels.map((model) => (
          <article className="model-card model-card-placeholder" key={model.name}>
            <div className="model-card-visual model-card-visual-placeholder">
              <span>{model.number}</span>
              <div className="placeholder-lines" aria-hidden="true"><i /><i /><i /></div>
              <span className="planned-label">Planned</span>
            </div>
            <div className="model-card-body">
              <div className="model-card-meta"><span>{model.category}</span><span>{model.input}</span></div>
              <h3>{model.name}</h3>
              <p>Reserved for a future model integration.</p>
              <span className="open-model open-model-muted">Coming next</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WorkspacePage;