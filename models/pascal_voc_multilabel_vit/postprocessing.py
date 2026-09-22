from typing import Any

import torch


def format_predictions(
    logits: torch.Tensor,
    id2label: dict[int, str],
    threshold: float,
) -> list[dict[str, Any]]:
    probabilities = torch.sigmoid(logits).squeeze(0).detach().cpu()
    predictions = [
        {
            "label": id2label[index],
            "score": round(float(probability), 6),
        }
        for index, probability in enumerate(probabilities)
        if float(probability) >= threshold
    ]
    return sorted(predictions, key=lambda prediction: prediction["score"], reverse=True)
