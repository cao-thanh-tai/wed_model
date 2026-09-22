import { useState } from "react";
import { Link } from "react-router-dom";
import { clearRunHistory, getRunHistory } from "../services/runHistory";

function RunsPage() {
  const [runs, setRuns] = useState(getRunHistory);

  function handleClear() {
    clearRunHistory();
    setRuns([]);
  }

  return (
    <section className="workspace-page" aria-labelledby="runs-title">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">Experiment log</p>
          <h2 id="runs-title">Your runs.</h2>
          <p className="intro-copy">A local board of recent model results.</p>
        </div>
        {runs.length > 0 && <button className="text-button" type="button" onClick={handleClear}>Clear history</button>}
      </div>

      {runs.length === 0 ? (
        <div className="empty-state runs-empty"><strong>No runs yet.</strong><p>Test a model and its results will appear here.</p><Link to="/">Browse models</Link></div>
      ) : (
        <div className="runs-table" role="table" aria-label="Inference run history">
          <div className="runs-table-header" role="row"><span>Model</span><span>Input</span><span>Top result</span><span>Time</span></div>
          {runs.map((run) => (
            <div className="run-row" role="row" key={run.id}>
              <span><strong>{run.modelName}</strong><small>{run.modelId}</small></span>
              <span>{run.fileName}</span>
              <span>{run.predictions[0] ? `${run.predictions[0].label} ${(run.predictions[0].score * 100).toFixed(1)}%` : "No label"}</span>
              <span>{new Date(run.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RunsPage;
