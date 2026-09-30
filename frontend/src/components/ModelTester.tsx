import { ChangeEvent, DragEvent, useEffect, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

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
          <button type="button" onClick={handleInference} disabled={!file || isLoading}>
            {isLoading ? "Running..." : "Run inference"}
          </button>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
      </div>

      <div className="results-panel">
        <div className="results-heading">
          <span className="eyebrow">Output</span>
          {predictions.length > 0 && <span>{predictions.length} labels</span>}
        </div>
        {isLoading ? (
          <div className="results-empty">
            <span>Analyzing image...</span>
            <p>The model is preparing its top predictions.</p>
          </div>
        ) : predictions.length > 0 ? (
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
            <span>{error ? "No result" : "Awaiting input"}</span>
            <p>{error ? "Fix the issue and run inference again." : "Prediction results will appear here."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelTester;
