const modelCoverImages: Record<string, string> = {
  "cub-200-2011": "/models/cub-200-2011/cover.jpg",
  "pascal-voc-multilabel-vit": "/models/pascal-voc-multilabel-vit/cover.jpg",
  "titanic-xgboost": "/models/titanic-xgboost/cover.jpg",
  "titanic-random-forest": "/models/titanic-random-forest/cover.jpg",
};

export function getModelCoverImage(modelId: string): string | null {
  return modelCoverImages[modelId] ?? null;
}