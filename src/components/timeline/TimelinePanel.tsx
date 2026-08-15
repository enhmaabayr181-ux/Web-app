import { Card, SectionTitle } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { useProjectStore } from "../../store/useProjectStore";
import { buildTimeline, formatTimecode, totalDuration } from "../../lib/srt";

export function TimelinePanel() {
  const project = useProjectStore((s) => s.project);
  const setFrameDuration = useProjectStore((s) => s.setFrameDuration);

  if (!project) {
    return <EmptyState hint="Timeline харахын тулд эхлээд комикоо үүсгэнэ үү." />;
  }

  const timeline = buildTimeline(project.frames);
  const total = totalDuration(project.frames);
  const maxDuration = Math.max(...project.frames.map((f) => f.duration), 1);

  return (
    <div className="flex flex-col gap-5 pb-8">
      <SectionTitle
        eyebrow="Reel Timeline"
        title="Кадрын хугацааны төлөвлөгөө"
        description={`Нийт урт: ${formatTimecode(total)} (${project.frames.length} кадр). Хугацаа өөрчлөгдөхөд SRT автоматаар шинэчлэгдэнэ.`}
      />

      <Card>
        <div className="flex flex-col gap-3">
          {timeline.map((entry) => {
            const frame = project.frames[entry.index];
            const widthPct = Math.max(8, (frame.duration / maxDuration) * 100);
            return (
              <div
                key={entry.frameId}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-2xl bg-white/70 border border-border-soft px-4 py-3"
              >
                <div className="flex items-center gap-2 sm:w-56 shrink-0">
                  <span className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-dark to-lavender-dark text-white text-xs font-semibold flex items-center justify-center">
                    {entry.index + 1}
                  </span>
                  <span className="text-sm font-mono text-ink-soft tabular-nums">
                    {formatTimecode(entry.start)}–{formatTimecode(entry.end)}
                  </span>
                  <span className="text-sm font-medium text-ink truncate">{entry.label}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink-soft truncate mb-1.5">{frame.text}</p>
                  <div className="h-2 rounded-full bg-cream overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-dark to-lavender-dark transition-all"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:w-40 shrink-0">
                  <input
                    type="range"
                    min={0.5}
                    max={10}
                    step={0.1}
                    value={frame.duration}
                    onChange={(e) => setFrameDuration(frame.id, Number(e.target.value))}
                    className="flex-1 accent-pink-dark"
                  />
                  <span className="text-xs font-semibold text-ink w-10 text-right tabular-nums">
                    {frame.duration.toFixed(1)}s
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
