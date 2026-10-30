# AI Hub Models

Each model gets its own directory under `models/`. The running backend uses
exported ONNX files through the shared ONNX Runtime adapter.

Expected structure for a new model:

```text
models/<model-id>/
├── README.md
└── web/
    ├── README.md
    ├── WEB_CONTEXT.md
    └── model/
        ├── <model-file>.onnx
        └── metadata.json
```

For each new model package, preserve the supplied `web/` directory under
`models/<model-id>/`. The model directory is both the storage location and the
integration location; no copy or staging step is required.

`web/model/metadata.json` describes the stable model identity and input/output
contract. `web/WEB_CONTEXT.md` records integration context that cannot be
inferred safely from the ONNX graph alone, such as preprocessing, labels,
thresholds, sample inputs, and expected outputs.

Model-specific preprocessing and postprocessing stay in the model directory.
Do not add a model to the backend registry until its ONNX file, metadata, and
known-good sample behavior have been verified.
