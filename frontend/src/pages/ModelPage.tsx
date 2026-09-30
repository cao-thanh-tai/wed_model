import { Link, useParams } from "react-router-dom";
import { ApiState, ModelMetadata } from "../services/api";
import { getModelCoverImage } from "../services/modelAssets";

type ModelPageProps = {
  apiState: ApiState;
  models: ModelMetadata[];
};

function ModelPage({ apiState, models }: ModelPageProps) {
  const { modelId } = useParams();
  const model = models.find((item) => item.id === modelId);

  if (apiState === "checking") {
    return <div className="page-message">Loading model...</div>;
  }

  if (!model) {
    return (
      <div className="page-message">
        <h2>Model not found</h2>
        <Link className="back-button" to="/">Back to models</Link>
      </div>
    );
  }

  return (
    <section className="workspace-page" aria-labelledby="model-title">
      <Link className="back-button" to="/">
        <span aria-hidden="true">←</span>
        <span>Back to models</span>
      </Link>
      <div className="model-detail-heading">
        <div className="model-detail-topline"><p className="eyebrow">{model.category}</p><span className="model-live-status"><i /> Ready to run</span></div>
        <h2 id="model-title">{model.name}</h2>
        <p className="intro-copy">{model.description}</p>
      </div>
      <div className="detail-actions">
        <Link className="primary-link" to={`/models/${model.id}/test`}>Test this model <span aria-hidden="true">-&gt;</span></Link>
        <span className="model-id">{model.id}</span>
      </div>
      {getModelCoverImage(model.id) && <img className="model-detail-cover" src={getModelCoverImage(model.id) ?? undefined} alt={`${model.name} preview`} />}
      <div className="model-hero-stats"><span><b>Input</b>{model.input_type}</span><span><b>Output</b>{model.output_type}</span><span><b>Signals</b>{Object.keys(model.metrics).length || "n/a"}</span></div>
      <div className="detail-grid">
        <article className="detail-panel detail-panel-wide">
          <p className="eyebrow">About this model</p>
          <h3>{model.name}</h3>
          <p>{model.description}</p>
          <div className="spec-list"><span><b>Input</b>{model.input_type}</span><span><b>Output</b>{model.output_type}</span><span><b>Metrics</b>{Object.keys(model.metrics).length || "Not available"}</span></div>
        </article>
        <article className="detail-panel metrics-panel">
          <p className="eyebrow">Evaluation</p>
          <div className="metric-list">
            {Object.entries(model.metrics).map(([name, value]) => <div className="metric-row" key={name}><span>{name.replace("_", " ")}</span><strong>{(value * 100).toFixed(1)}%</strong></div>)}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ModelPage;