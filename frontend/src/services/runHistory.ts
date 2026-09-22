import { RunRecord } from "../types/runs";

const STORAGE_KEY = "ai-hub-run-history";

export function getRunHistory(): RunRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as RunRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveRun(run: RunRecord): void {
  const history = [run, ...getRunHistory()].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearRunHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
