from typing import Any

import numpy as np
import torch
from PIL import Image


def prepare_image(image: Image.Image) -> dict[str, Any]:
    rgb_image = image.convert("RGB").resize((224, 224), Image.Resampling.BICUBIC)
    image_array = np.asarray(rgb_image, dtype=np.float32) / 255.0
    image_array = (image_array - 0.5) / 0.5
    pixel_values = torch.from_numpy(image_array).permute(2, 0, 1).unsqueeze(0)
    return {"pixel_values": pixel_values}
