import { Button } from "./Button";
import { useProjectStore } from "../../store/useProjectStore";

export function EmptyState({ hint }: { hint: string }) {
  const setActiveTab = useProjectStore((s) => s.setActiveTab);
  return (
    <div className="glass rounded-3xl shadow-card p-10 text-center flex flex-col items-center gap-3">
      <div className="text-4xl">🎬</div>
      <h3 className="text-lg font-semibold text-ink">Одоогоор комик байхгүй байна</h3>
      <p className="text-sm text-ink-soft max-w-sm">{hint}</p>
      <Button variant="primary" onClick={() => setActiveTab("studio")} className="mt-2">
        ✨ Studio руу очих
      </Button>
    </div>
  );
}
