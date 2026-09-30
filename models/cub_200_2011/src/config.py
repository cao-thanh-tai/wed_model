# src/config.py
import os
from pathlib import Path

# ======================
# Đường dẫn
# ======================
ROOT_DIR = Path(__file__).resolve().parent.parent          # thư mục gốc project
DATA_DIR = ROOT_DIR / "data/raw" / "CUB_200_2011"              # <-- sửa nếu cần
CHECKPOINT_DIR = ROOT_DIR / "models"
CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)

# ======================
# Data
# ======================
IMG_SIZE = 224                 # tạm thời 224 cho nhanh (sau nâng lên 448)
BATCH_SIZE = 32
NUM_WORKERS = 4                # trên .py có thể để 4
PIN_MEMORY = True

# ======================
# Model
# ======================
NUM_CLASSES = 200
PRETRAINED = True
BACKBONE = "resnet50"          # dễ đổi sau này

# ======================
# Training
# ======================
NUM_EPOCHS = 30
LEARNING_RATE = 0.01
MOMENTUM = 0.9
WEIGHT_DECAY = 1e-4
STEP_SIZE = 15                 # scheduler
GAMMA = 0.1

# ======================
# Khác
# ======================
SEED = 42
DEVICE = "cuda"                # sẽ được ghi đè trong code nếu không có GPU