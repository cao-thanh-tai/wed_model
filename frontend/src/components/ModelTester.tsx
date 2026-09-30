import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { inferImage, Prediction, releaseImageModel } from "../services/api";
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
  const [isDragging, setIsDragging] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [isReleasing, setIsReleasing] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelLoadTimeMs, setModelLoadTimeMs] = useState<number | null>(null);
  const [inferenceTimeMs, setInferenceTimeMs] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function selectFile(selectedFile: File | undefined) {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setPredictions([]);
    setError(null);
    setModelLoadTimeMs(null);
    setInferenceTimeMs(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  async function handleInference() {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await inferImage(modelId, file);
      setPredictions(result.predictions);
      setModelReady(true);
      setModelLoadTimeMs(result.model_load_time_ms);
      setInferenceTimeMs(result.inference_time_ms);
      saveRun({ id: crypto.randomUUID(), modelId, modelName, fileName: file.name, predictions: result.predictions, createdAt: new Date().toISOString() });
    } catch {
      setError("Inference failed. Check that the backend and model are running.");
    } finally {
      setIsLoading(false);
    }
  }

  async function releaseModel() {
    setIsReleasing(true);
    setError(null);
    try {
      await releaseImageModel(modelId);
      setModelReady(false);
      setModelLoadTimeMs(null);
      setInferenceTimeMs(null);
    } catch {
      setError("Model memory could not be released. Check that the backend is running.");
    } finally {
      setIsReleasing(false);
    }
  }

  async function copyPredictions() {
    const text = predictions
      .map((prediction, index) => `${index + 1}. ${prediction.label}: ${(prediction.score * 100).toFixed(1)}%`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(`${modelName}\n${text}`);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setError("Clipboard access is unavailable. Use JSON download instead.");
    }
  }

  function downloadPredictions() {
    const payload = JSON.stringify({ model_id: modelId, model: modelName, file: file?.name, predictions }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${modelId}-prediction.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="tester-grid">
      <div className="upload-panel">
        <label
          className={`upload-zone ${previewUrl ? "has-preview" : ""} ${isDragging ? "is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Selected input" />
          ) : (
            <>
              <span className="upload-symbol">+</span>
              <strong>{isDragging ? "Release to upload" : "Drop an image here"}</strong>
              <span>or choose a file from your device</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <div className="tester-actions">
          <span className="file-name">{file?.name ?? "No image selected"}</span>
          <button type="button" onClick={handleInference} disabled={!file || isLoading || isReleasing}>
            {isLoading ? "Running..." : "Run inference"}
          </button>
          <button className="release-button" type="button" onClick={releaseModel} disabled={isLoading || isReleasing || !modelReady}>
            {isReleasing ? "Releasing..." : "Release memory"}
          </button>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
      </div>

      <div className="results-panel">
        <div className="results-heading">
          <span className="eyebrow">Output</span>
          {predictions.length > 0 && <div className="result-tools"><span>{predictions.length} labels</span><button type="button" onClick={copyPredictions}>{copyState === "copied" ? "Copied" : "Copy"}</button><button type="button" onClick={downloadPredictions}>JSON</button></div>}
        </div>
        {(modelLoadTimeMs !== null || inferenceTimeMs !== null) && <div className="timing-strip"><span>{modelLoadTimeMs !== null ? `Loaded in ${(modelLoadTimeMs / 1000).toFixed(2)}s` : "Model cached"}</span><span>Inference {inferenceTimeMs?.toFixed(0)}ms</span></div>}
        {isLoading ? (
          <div className="results-empty">
            <span>{modelReady ? "Running inference..." : "Loading model..."}</span>
            <p>{modelReady ? "The model is preparing its top predictions." : "The first run may take a little longer while weights are loaded."}</p>
          </div>
        ) : predictions.length > 0 ? (
          <ul className="prediction-list">
          {predictions.map((prediction, index) => (
            <li key={`${prediction.label}-${index}`}>
              <div className="prediction-copy">
                <span className="prediction-rank">{String(index + 1).padStart(2, "0")}</span>
                <span>{prediction.label}</span>
              </div>
              <div className="prediction-value">
                <span className="prediction-score">{(prediction.score * 100).toFixed(1)}%</span>
                <span className="prediction-bar" aria-hidden="true"><i style={{ width: `${Math.max(prediction.score * 100, 2)}%` }} /></span>
              </div>
            </li>
          ))}
          </ul>
        ) : (
          <div className="results-empty">
            <span>{error ? "No result" : "Awaiting input"}</span>
            <p>{error ? "Fix the issue and run inference again." : "Prediction results will appear here."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelTester;
