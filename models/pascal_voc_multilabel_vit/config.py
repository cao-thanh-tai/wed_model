from pathlib import Path

MODEL_ID = "pascal-voc-multilabel-vit"
MODEL_NAME = "Pascal VOC Multi-label ViT"
MODEL_DESCRIPTION = "Vision Transformer for multi-label Pascal VOC image classification."
MODEL_CATEGORY = "Computer Vision"
INPUT_TYPE = "image"
OUTPUT_TYPE = "multi-label classification"
THRESHOLD = 0.5

MODEL_DIR = Path(__file__).resolve().parent / "weights" / "voc-multilabel-vit"
