import { Link, useParams } from "react-router-dom";
import ModelTester from "../components/ModelTester";
import TabularTester from "../components/TabularTester";
import { ApiState, ModelMetadata } from "../services/api";

type ModelTestPageProps = {
  apiState: ApiState;
  models: ModelMetadata[];
};

function ModelTestPage({ apiState, models }: ModelTestPageProps) {
  const { modelId } = useParams();
  const model = models.find((item) => item.id === modelId);

  if (apiState === "checking") return <div className="page-message">Loading model...</div>;
  if (!model) {
    return <div className="page-message"><h2>Model not found</h2><Link className="back-button" to="/">Back to models</Link></div>;
  }

  return (
    <section className="workspace-page" aria-labelledby="tester-title">
      <Link className="back-button" to={`/models/${model.id}`}>
        <span aria-hidden="true">←</span>
        <span>Back to model details</span>
      </Link>
      <div className="tester-page-heading">
        <p className="eyebrow">Inference desk</p>
        <h2 id="tester-title">Test {model.name}</h2>
        <p className="intro-copy">Upload an image and inspect what the model finds.</p>
      </div>
      <article className="model-workspace tester-page-card" aria-label="Model test area">
        {model.input_type === "tabular" ? (
          <TabularTester modelId={model.id} modelName={model.name} />
        ) : (
          <ModelTester modelId={model.id} modelName={model.name} />
        )}
      </article>
    </section>
  );
}

export default ModelTestPage;
