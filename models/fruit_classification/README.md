# Fruit Classification

This directory is the home of the Fruit Classification model package.

## Submitted package structure

The supplied package is kept under the `web` directory:

```text
models/fruit_classification/
├── README.md
└── web/
    ├── README.md
    ├── WEB_CONTEXT.md
    └── model/
        ├── fruit_classifier.onnx
        └── metadata.json
```

The model files are located at
`models/fruit_classification/web/model/`. The package README and context are
located at `models/fruit_classification/web/`.

The ONNX file and `metadata.json` are the source of truth for the backend
adapter. This model has been reviewed and is registered as
`fruit-classification`.

## Integration checklist

1. Validate the ONNX graph and inspect its input/output names and shapes.
2. Read the labels, preprocessing, threshold, and output format from
   `metadata.json` and `WEB_CONTEXT.md`.
3. Add a model adapter using the shared ONNX Runtime interface.
4. Register the model metadata in the unified backend registry.
5. Add or update the generic frontend model asset and tester configuration only
   where the model contract requires it.
6. Test a known sample and verify the response shape and predicted labels.

The original training framework and checkpoint are not required by the
running backend.
