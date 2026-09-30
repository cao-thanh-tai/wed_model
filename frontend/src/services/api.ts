const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8001";
const ML_API_BASE_URL = import.meta.env.VITE_ML_API_BASE_URL ?? "http://127.0.0.1:8002";

export type ModelMetadata = {
  id: string;
  name: string;
  description: string;
  category: string;
  input_type: string;
  output_type: string;
  metrics: Record<string, number>;
  source?: "cv" | "ml";
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
  source: "cv" | "ml";
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

export async function getMlModels(): Promise<ModelMetadata[]> {
  const response = await fetch(`${ML_API_BASE_URL}/api/v1/models`);

  if (!response.ok) {
    throw new Error(`ML model request failed: ${response.status}`);
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

export async function releaseImageModel(modelId: string, source: "cv" | "ml" = "cv"): Promise<{ model_id: string; unloaded: boolean }> {
  const baseUrl = source === "ml" ? ML_API_BASE_URL : API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/v1/models/${modelId}/runtime`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`Model release failed: ${response.status}`);
  }

  return response.json() as Promise<{ model_id: string; unloaded: boolean }>;
}

export async function getLoadedModels(): Promise<LoadedModel[]> {
  const [cvResponse, mlResponse] = await Promise.allSettled([
    fetch(`${API_BASE_URL}/api/v1/models/runtime`),
    fetch(`${ML_API_BASE_URL}/api/v1/models/runtime`),
  ]);
  const loaded: LoadedModel[] = [];
  if (cvResponse.status === "fulfilled" && cvResponse.value.ok) {
    loaded.push(...(await cvResponse.value.json() as LoadedModel[]).map((model) => ({ ...model, source: "cv" as const })));
  }
  if (mlResponse.status === "fulfilled" && mlResponse.value.ok) {
    loaded.push(...(await mlResponse.value.json() as LoadedModel[]).map((model) => ({ ...model, source: "ml" as const })));
  }
  return loaded;
}

export async function inferTabular(
  modelId: string,
  features: Record<string, number | string>,
): Promise<{ model_id: string; result: TabularPrediction }> {
  const response = await fetch(`${ML_API_BASE_URL}/api/v1/inference/${modelId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    throw new Error(`ML inference request failed: ${response.status}`);
  }

  return response.json() as Promise<{ model_id: string; result: TabularPrediction }>;
}
