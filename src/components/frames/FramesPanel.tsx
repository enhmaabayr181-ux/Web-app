import { Card } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { MongolianCheckBadge } from "../common/MongolianCheckBadge";
import { FrameCard } from "./FrameCard";
import { useProjectStore } from "../../store/useProjectStore";

export function FramesPanel() {
  const project = useProjectStore((s) => s.project);

  if (!project) {
    return (
      <EmptyState hint="Эхлээд Studio хэсэгт сэдвээ бичээд, Комик үүсгэх товч дарна уу." />
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      <Card className="animate-fade-up">
        <p className="text-xs font-semibold tracking-wide uppercase text-pink-dark mb-1">
          Reel title
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-ink mb-3">{project.title}</h1>

        <p className="text-xs font-semibold tracking-wide uppercase text-lavender-dark mb-1">
          Hook
        </p>
        <p className="text-sm text-ink-soft italic mb-3">“{project.hook}”</p>

        <p className="text-xs font-semibold tracking-wide uppercase text-ink-soft/70 mb-1">
          Character consistency
        </p>
        <p className="text-xs text-ink-soft font-mono bg-white/60 rounded-xl px-3 py-2">
          {project.character}
        </p>
      </Card>

      <MongolianCheckBadge />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {project.frames.map((frame, idx) => (
          <FrameCard key={frame.id} frame={frame} index={idx} total={project.frames.length} />
        ))}
      </div>
    </div>
  );
}
