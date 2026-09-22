import { ChangeEvent, useEffect, useState } from "react";
import { inferImage, Prediction } from "../services/api";
import { saveRun } from "../services/runHistory";

type ModelTesterProps = {
  modelId: string;
  modelName: string;
};

function ModelTester({ modelId, modelName }: ModelTesterProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setPredictions([]);
    setError(null);
  }

  async function handleInference() {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setPredictions([]);

    try {
      const result = await inferImage(modelId, file);
      setPredictions(result.predictions);
      saveRun({ id: crypto.randomUUID(), modelId, modelName, fileName: file.name, predictions: result.predictions, createdAt: new Date().toISOString() });
    } catch {
      setError("Inference failed. Check that the backend and model are running.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="tester-grid">
      <div className="upload-panel">
        <label className={`upload-zone ${previewUrl ? "has-preview" : ""}`}>
          {previewUrl ? (
            <img src={previewUrl} alt="Selected input" />
          ) : (
            <>
              <span className="upload-symbol">+</span>
              <strong>Drop an image here</strong>
              <span>or choose a file from your device</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <div className="tester-actions">
          <span className="file-name">{file?.name ?? "No image selected"}</span>
          <button type="button" onClick={handleInference} disabled={!file || isLoading}>
            {isLoading ? "Running..." : "Run inference"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="results-panel">
        <div className="results-heading">
          <span className="eyebrow">Output</span>
          {predictions.length > 0 && <span>{predictions.length} labels</span>}
        </div>
        {predictions.length > 0 ? (
          <ul className="prediction-list">
          {predictions.map((prediction) => (
            <li key={prediction.label}>
              <span>{prediction.label}</span>
              <span className="prediction-score">{(prediction.score * 100).toFixed(1)}%</span>
            </li>
          ))}
          </ul>
        ) : (
          <div className="results-empty">
            <span>Awaiting input</span>
            <p>Prediction results will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelTester;
