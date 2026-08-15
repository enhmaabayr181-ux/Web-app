import { useProjectStore } from "../../store/useProjectStore";

export function MongolianCheckBadge() {
  const mongolianCheck = useProjectStore((s) => s.mongolianCheck);
  const runProofread = useProjectStore((s) => s.runProofread);
  const project = useProjectStore((s) => s.project);

  if (!project) return null;

  const { status, issues } = mongolianCheck;

  return (
    <div className="rounded-2xl border border-border-soft bg-white/70 px-4 py-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {status === "checking" && (
            <span className="h-2.5 w-2.5 rounded-full bg-lavender-dark animate-pulse" />
          )}
          {status === "pass" && <span className="text-emerald-500">✓</span>}
          {status === "issues" && <span className="text-amber-500">!</span>}
          {status === "idle" && <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />}
          <span className="text-sm font-semibold text-ink">Монгол хэлний шалгалт</span>
        </div>
        <button
          onClick={runProofread}
          className="text-xs font-medium text-pink-dark hover:underline"
        >
          Дахин шалгах
        </button>
      </div>
      <p className="text-xs text-ink-soft mt-1.5">
        {status === "checking" && "Шалгаж байна…"}
        {status === "pass" && "Бүх кадрын текст шалгалтыг давлаа. Алдаа олдсонгүй."}
        {status === "issues" &&
          `${issues.length} зөвлөмж олдлоо. Кадруудаа дахин харна уу.`}
        {status === "idle" && "Комик үүсгэсний дараа автоматаар шалгагдана."}
      </p>
      {status === "issues" && issues.length > 0 && (
        <ul className="mt-2 space-y-1">
          {issues.slice(0, 6).map((issue, i) => (
            <li key={i} className="text-xs text-amber-600 flex gap-1.5">
              <span>•</span>
              <span>
                Кадр {issue.frameId}: {issue.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
