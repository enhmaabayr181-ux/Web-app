import { NAV_ITEMS } from "../../constants";
import { useProjectStore } from "../../store/useProjectStore";

export function BottomNav() {
  const activeTab = useProjectStore((s) => s.activeTab);
  const setActiveTab = useProjectStore((s) => s.setActiveTab);
  const project = useProjectStore((s) => s.project);

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-border-soft px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
      <div className="flex items-stretch justify-between max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = item.id === activeTab;
          const disabled = item.id !== "studio" && !project;
          return (
            <button
              key={item.id}
              disabled={disabled}
              onClick={() => setActiveTab(item.id)}
              className={[
                "flex flex-1 flex-col items-center gap-0.5 py-1.5 rounded-2xl transition-all",
                active ? "text-pink-dark" : "text-ink-soft",
                disabled ? "opacity-30" : "",
              ].join(" ")}
            >
              <span className={["text-xl transition-transform", active ? "scale-110" : ""].join(" ")}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
