import { Link } from "react-router-dom";
import { ApiState, ModelMetadata } from "../services/api";
import { getModelCoverImage } from "../services/modelAssets";

type WorkspacePageProps = {
  apiState: ApiState;
  models: ModelMetadata[];
  search: string;
};

const plannedModels = [
  { name: "Object Detection", category: "Computer Vision", input: "image", number: "02" },
  { name: "Image Segmentation", category: "Computer Vision", input: "image", number: "03" },
  { name: "Text Classification", category: "Natural Language", input: "text", number: "04" },
];

function WorkspacePage({ apiState, models, search }: WorkspacePageProps) {
  const normalizedSearch = search.trim().toLowerCase();
  const filteredModels = models.filter((model) =>
    [model.name, model.category, model.input_type, model.output_type].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );

  return (
    <section className="workspace-page" aria-labelledby="workspace-title">
      <div className="workspace-hero">
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
        <a className="hero-start-button" href="#model-catalogue">
          Start exploring <span aria-hidden="true">-&gt;</span>
        </a>
        <a className="hero-scroll-cue" href="#model-catalogue">
          <span>Scroll to explore</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="workspace-models" id="model-catalogue">
        <div className="catalogue-heading">
          <p className="eyebrow">Available models</p>
          <p>Choose a model to inspect its capabilities and run an inference.</p>
        </div>

        {filteredModels.length === 0 && apiState !== "checking" && (
          <div className="empty-state">No models are available right now.</div>
        )}

        {apiState === "checking" ? (
          <div className="showcase-list" aria-label="Loading models">
            {[0, 1, 2].map((item) => <div className="model-showcase-skeleton" key={item}><div /><div /></div>)}
          </div>
        ) : <div className="showcase-list" aria-label="Available models">
          {filteredModels.map((model, index) => {
            const coverImage = getModelCoverImage(model.id);
            return (
              <article className={`model-showcase-row ${index % 2 === 1 ? "is-reversed" : ""}`} key={model.id}>
                <div className={`model-showcase-visual model-card-visual-${index % 3} model-card-visual-${model.source ?? "onnx"}`}>
                  <span className="showcase-index">{String(index + 1).padStart(2, "0")}</span>
                  {coverImage ? <img src={coverImage} alt="" /> : <div className="visual-specimen" aria-hidden="true"><i /><i /><i /></div>}
                  <strong>{model.input_type === "image" ? "VISION" : "TABULAR"}</strong>
                </div>
                <div className="model-showcase-copy">
                  <div className="model-card-meta"><span>{model.category}</span><span>{model.input_type}</span></div>
                  <h3>{model.name}</h3>
                  <p>{model.description}</p>
                  <div className="showcase-stats"><span><b>Output</b>{model.output_type}</span><span><b>Metrics</b>{Object.keys(model.metrics).length || "n/a"}</span></div>
                  <Link className="primary-link" to={`/models/${model.id}`}>View model <span aria-hidden="true">-&gt;</span></Link>
                </div>
              </article>
            );
          })}

          {normalizedSearch === "" && plannedModels.map((model) => (
            <article className="model-showcase-row model-showcase-planned is-reversed" key={model.name}>
              <div className="model-showcase-visual model-card-visual-placeholder">
                <span className="showcase-index">{model.number}</span>
                <div className="placeholder-lines" aria-hidden="true"><i /><i /><i /></div>
                <span className="planned-label">Planned</span>
              </div>
              <div className="model-showcase-copy">
                <div className="model-card-meta"><span>{model.category}</span><span>{model.input}</span></div>
                <h3>{model.name}</h3>
                <p>Reserved for a future model integration.</p>
                <span className="open-model open-model-muted">Coming next</span>
              </div>
            </article>
          ))}
        </div>}
      </div>
    </section>
  );
}

export default WorkspacePage;