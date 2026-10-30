const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export type ModelMetadata = {
  id: string;
  name: string;
  description: string;
  category: string;
  input_type: string;
  output_type: string;
  metrics: Record<string, number>;
  source?: "onnx";
};

export type Prediction = {
  label: string;
  score: number;
};

export type TabularPrediction = {
  prediction: number;
  probabilities?: number[];
};

export type ApiState = "checking" | "online" | "offline";

export type LoadedModel = {
  model_id: string;
  loaded_at: string;
  load_time_ms: number;
  device: string;
  source: "onnx";
};

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/health`);

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json() as Promise<{ status: string }>;
}

export async function getModels(): Promise<ModelMetadata[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/models`);

  if (!response.ok) {
    throw new Error(`Model request failed: ${response.status}`);
  }

  return response.json() as Promise<ModelMetadata[]>;
}

export async function inferImage(
  modelId: string,
  file: File,
): Promise<{
  model_id: string;
  predictions: Prediction[];
  model_load_time_ms: number | null;
  inference_time_ms: number;
  model_was_loaded: boolean;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/inference/${modelId}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Inference request failed: ${response.status}`);
  }

  return response.json() as Promise<{
    model_id: string;
    predictions: Prediction[];
    model_load_time_ms: number | null;
    inference_time_ms: number;
    model_was_loaded: boolean;
  }>;
}

export async function releaseImageModel(modelId: string): Promise<{ model_id: string; unloaded: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/models/${modelId}/runtime`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`Model release failed: ${response.status}`);
  }

  return response.json() as Promise<{ model_id: string; unloaded: boolean }>;
}

export async function getLoadedModels(): Promise<LoadedModel[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/models/runtime`);
  const loaded: LoadedModel[] = [];
  if (response.ok) {
    loaded.push(...(await response.json() as LoadedModel[]).map((model) => ({ ...model, source: "onnx" as const })));
  }
  return loaded;
}
