import { FormEvent, useState } from "react";
import { inferTabular, TabularPrediction } from "../services/api";
import { saveRun } from "../services/runHistory";

type TabularTesterProps = { modelId: string; modelName: string };

function TabularTester({ modelId, modelName }: TabularTesterProps) {
  const [form, setForm] = useState({ Pclass: "1", Sex: "female", Age: "30", SibSp: "0", Parch: "0" });
  const [result, setResult] = useState<TabularPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await inferTabular(modelId, {
        Pclass: Number(form.Pclass), Sex: form.Sex, Age: Number(form.Age),
        SibSp: Number(form.SibSp), Parch: Number(form.Parch),
      });
      setResult(response.result);
      saveRun({ id: crypto.randomUUID(), modelId, modelName, fileName: "Passenger form", predictions: [{ label: response.result.prediction === 1 ? "survived" : "did_not_survive", score: response.result.probabilities?.[response.result.prediction] ?? 1 }], createdAt: new Date().toISOString() });
    } catch {
      setError("Prediction failed. Check that the ML backend is running.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="tabular-tester">
      <form className="passenger-form" onSubmit={handleSubmit}>
        <label>Passenger class<select value={form.Pclass} onChange={(event) => updateField("Pclass", event.target.value)}><option value="1">1st class</option><option value="2">2nd class</option><option value="3">3rd class</option></select></label>
        <label>Sex<select value={form.Sex} onChange={(event) => updateField("Sex", event.target.value)}><option value="female">Female</option><option value="male">Male</option></select></label>
        <label>Age<input type="number" min="0" max="100" value={form.Age} onChange={(event) => updateField("Age", event.target.value)} required /></label>
        <label>Siblings / spouses<input type="number" min="0" value={form.SibSp} onChange={(event) => updateField("SibSp", event.target.value)} required /></label>
        <label>Parents / children<input type="number" min="0" value={form.Parch} onChange={(event) => updateField("Parch", event.target.value)} required /></label>
        <button className="form-submit" type="submit" disabled={isLoading}>{isLoading ? "Predicting..." : "Predict survival"}</button>
      </form>
      <div className="tabular-result">
        <span className="eyebrow">Prediction</span>
        {result ? <><strong>{result.prediction === 1 ? "Survived" : "Did not survive"}</strong><p>{result.probabilities ? `${(result.probabilities[result.prediction] * 100).toFixed(1)}% model confidence` : "Prediction complete"}</p></> : <p>Fill the passenger details to run the model.</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default TabularTester;
