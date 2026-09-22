import { Prediction } from "../services/api";

export type RunRecord = {
  id: string;
  modelId: string;
  modelName: string;
  fileName: string;
  predictions: Prediction[];
  createdAt: string;
};
