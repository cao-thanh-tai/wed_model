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
): Promise<{ model_id: string; predictions: Prediction[] }> {
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
  }>;
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
