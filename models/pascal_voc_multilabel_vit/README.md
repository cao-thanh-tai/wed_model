# Pascal VOC Multi-label ViT

This model classifies Pascal VOC object labels in an image. One image may
produce multiple labels.

- Input: RGB image
- Input size: 224x224
- Output: labels with sigmoid scores
- Default threshold: 0.5
- Deployment weights: `weights/voc-multilabel-vit/`
- Best training checkpoint: `checkpoint-1256`

`model_info.ipynb` and `1.0-eda.ipynb` are development references. Runtime
code lives in the Python modules in this directory.
