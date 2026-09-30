# src/data/dataset.py
import os
import pandas as pd
from PIL import Image
from torch.utils.data import Dataset
import torchvision.transforms as T

from src.config import DATA_DIR, IMG_SIZE


class CUB200(Dataset):
    def __init__(self, root=DATA_DIR, train=True, transform=None):
        self.root = root
        self.transform = transform
        self.train = train

        images = pd.read_csv(os.path.join(root, "images.txt"), sep=" ", names=["img_id", "filepath"])
        labels = pd.read_csv(os.path.join(root, "image_class_labels.txt"), sep=" ", names=["img_id", "target"])
        split  = pd.read_csv(os.path.join(root, "train_test_split.txt"), sep=" ", names=["img_id", "is_train"])

        data = images.merge(labels, on="img_id").merge(split, on="img_id")

        if train:
            self.data = data[data["is_train"] == 1].reset_index(drop=True)
        else:
            self.data = data[data["is_train"] == 0].reset_index(drop=True)

        self.data["target"] = self.data["target"] - 1   # 0-based

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        row = self.data.iloc[idx]
        img_path = os.path.join(self.root, "images", row["filepath"])
        image = Image.open(img_path).convert("RGB")
        label = int(row["target"])

        if self.transform is not None:
            image = self.transform(image)

        return image, label


def get_transforms(train: bool = True):
    if train:
        return T.Compose([
            T.Resize(256),
            T.RandomResizedCrop(IMG_SIZE, scale=(0.7, 1.0)),
            T.RandomHorizontalFlip(p=0.5),
            T.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225]),
        ])
    else:
        return T.Compose([
            T.Resize(256),
            T.CenterCrop(IMG_SIZE),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225]),
        ])