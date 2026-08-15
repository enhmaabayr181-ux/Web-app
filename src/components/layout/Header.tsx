import { useState } from "react";
import { Button } from "../common/Button";
import { useProjectStore } from "../../store/useProjectStore";

export function Header() {
  const project = useProjectStore((s) => s.project);
  const newProject = useProjectStore((s) => s.newProject);
  const [confirming, setConfirming] = useState(false);

  const handleNewProject = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    newProject();
    setConfirming(false);
  };

  return (
    <header className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-6 pb-2 lg:pt-8">
      <div className="lg:hidden flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-pink-dark to-lavender-dark flex items-center justify-center text-base shadow-soft">
          ✨
        </div>
        <p className="font-semibold text-ink">Comic Reel Studio</p>
      </div>
      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold text-ink">
          {project ? project.title : "Comic Reel Studio"}
        </h1>
        <p className="text-xs text-ink-soft">Санаагаа бич. Комик Reel-ээ бэлэн болго.</p>
      </div>
      {project && (
        <Button variant={confirming ? "danger" : "ghost"} size="sm" onClick={handleNewProject}>
          {confirming ? "Итгэлтэй байна уу?" : "+ New Project"}
        </Button>
      )}
    </header>
  );
}
