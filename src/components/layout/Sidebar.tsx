import { NAV_ITEMS } from "../../constants";
import { useProjectStore } from "../../store/useProjectStore";

export function Sidebar() {
  const activeTab = useProjectStore((s) => s.activeTab);
  const setActiveTab = useProjectStore((s) => s.setActiveTab);
  const project = useProjectStore((s) => s.project);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-1 py-8 px-4 sticky top-0 h-screen">
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-dark to-lavender-dark flex items-center justify-center text-lg shadow-soft">
          ✨
        </div>
        <div>
          <p className="font-semibold text-ink leading-tight">Comic Reel</p>
          <p className="text-xs text-ink-soft leading-tight">Studio</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.id === activeTab;
          const disabled = item.id !== "studio" && !project;
          return (
            <button
              key={item.id}
              disabled={disabled}
              onClick={() => setActiveTab(item.id)}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left",
                active
                  ? "bg-white shadow-card text-ink"
                  : "text-ink-soft hover:bg-white/60",
                disabled ? "opacity-40 cursor-not-allowed hover:bg-transparent" : "",
              ].join(" ")}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3">
        <p className="text-[11px] text-ink-soft leading-relaxed">
          Санаагаа бич. Комик Reel-ээ бэлэн болго. 🇲🇳
        </p>
      </div>
    </aside>
  );
}
