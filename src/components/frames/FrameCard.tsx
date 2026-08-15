import { useState, type ReactNode } from "react";
import type { Frame } from "../../types";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { useProjectStore } from "../../store/useProjectStore";

const STYLE_EMOJI: Record<string, string> = {
  modern_pastel: "🎀",
  korean_webtoon: "🌸",
  watercolor: "🎨",
  dreamy_illustration: "☁️",
  cute_editorial: "💫",
  minimal_comic: "◽",
  cinematic_comic: "🎬",
};

export function FrameCard({
  frame,
  index,
  total,
}: {
  frame: Frame;
  index: number;
  total: number;
}) {
  const updateFrame = useProjectStore((s) => s.updateFrame);
  const deleteFrame = useProjectStore((s) => s.deleteFrame);
  const moveFrame = useProjectStore((s) => s.moveFrame);
  const regenerateFramePrompt = useProjectStore((s) => s.regenerateFramePrompt);
  const generateFrameImage = useProjectStore((s) => s.generateFrameImage);
  const reportImageLoadError = useProjectStore((s) => s.reportImageLoadError);
  const imageState = useProjectStore((s) => s.imageGenState[frame.id]);
  const style = useProjectStore((s) => s.settings.style);

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(frame.imagePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
      return;
    }
    deleteFrame(frame.id);
  };

  return (
    <Card className="relative overflow-visible">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-dark to-lavender-dark text-white text-sm font-semibold flex items-center justify-center shadow-soft">
            {index + 1}
          </span>
          <p className="font-semibold text-ink text-sm">Кадр {index + 1}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Дээш зөөх"
            disabled={index === 0}
            onClick={() => moveFrame(frame.id, "up")}
            className="h-8 w-8 rounded-full flex items-center justify-center text-ink-soft hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            ↑
          </button>
          <button
            aria-label="Доош зөөх"
            disabled={index === total - 1}
            onClick={() => moveFrame(frame.id, "down")}
            className="h-8 w-8 rounded-full flex items-center justify-center text-ink-soft hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            ↓
          </button>
        </div>
      </div>

      <div className="aspect-[9/16] max-h-64 w-full rounded-2xl bg-gradient-to-br from-peach via-pink to-lavender flex flex-col items-center justify-center gap-2 mb-4 relative overflow-hidden">
        {frame.imageUrl ? (
          <img
            src={frame.imageUrl}
            alt={frame.text}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => reportImageLoadError(frame.id)}
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
            <span className="text-4xl relative">{STYLE_EMOJI[style] ?? "🎨"}</span>
            {imageState?.loading ? (
              <p className="text-xs text-ink/70 font-medium relative px-6 text-center flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ink/60 animate-pulse" />
                Зураг үүсгэж байна…
              </p>
            ) : (
              <p className="text-xs text-ink/60 font-medium relative px-6 text-center">
                Preview — доорх товчоор жинхэнэ зураг үүсгэнэ
              </p>
            )}
          </>
        )}
        <button
          onClick={() => generateFrameImage(frame.id)}
          disabled={imageState?.loading}
          className="absolute bottom-2 right-2 text-xs font-medium bg-white/90 hover:bg-white text-ink px-3 py-1.5 rounded-full shadow-card disabled:opacity-60 transition-colors"
        >
          {imageState?.loading ? "…" : frame.imageUrl ? "↻ Дахин үүсгэх" : "🖼 Зураг үүсгэх"}
        </button>
      </div>
      {imageState?.error && (
        <p className="text-xs text-rose-500 -mt-2.5 mb-3.5">{imageState.error}</p>
      )}

      <Field label="Дэлгэцийн текст">
        {isEditing ? (
          <textarea
            value={frame.text}
            onChange={(e) => updateFrame(frame.id, { text: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-xl border border-border-soft bg-white/80 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pink-dark/40"
          />
        ) : (
          <p className="text-sm text-ink font-medium leading-snug">{frame.text}</p>
        )}
      </Field>

      <Field label="Үйл явдал">
        {isEditing ? (
          <textarea
            value={frame.scene}
            onChange={(e) => updateFrame(frame.id, { scene: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-xl border border-border-soft bg-white/80 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pink-dark/40"
          />
        ) : (
          <p className="text-sm text-ink-soft leading-snug">{frame.scene}</p>
        )}
      </Field>

      <Field label="Emotion">
        {isEditing ? (
          <input
            value={frame.emotion}
            onChange={(e) => updateFrame(frame.id, { emotion: e.target.value })}
            className="w-full rounded-xl border border-border-soft bg-white/80 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pink-dark/40"
          />
        ) : (
          <span className="inline-block text-xs font-medium text-lavender-dark bg-lavender/50 px-2.5 py-1 rounded-full">
            {frame.emotion}
          </span>
        )}
      </Field>

      <Field label="Зураглалын prompt (image prompt)">
        {isEditing ? (
          <textarea
            value={frame.imagePrompt}
            onChange={(e) => updateFrame(frame.id, { imagePrompt: e.target.value })}
            rows={4}
            className="w-full resize-none rounded-xl border border-border-soft bg-white/80 px-3 py-2 text-xs text-ink-soft font-mono focus:outline-none focus:ring-2 focus:ring-pink-dark/40"
          />
        ) : (
          <p className="text-xs text-ink-soft leading-relaxed font-mono bg-white/60 rounded-xl px-3 py-2 max-h-24 overflow-y-auto scrollbar-none">
            {frame.imagePrompt}
          </p>
        )}
      </Field>

      <Field label="Duration (секунд)">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={frame.duration}
            onChange={(e) => updateFrame(frame.id, { duration: Number(e.target.value) })}
            className="flex-1 accent-pink-dark"
          />
          <span className="text-sm font-semibold text-ink w-12 text-right tabular-nums">
            {frame.duration.toFixed(1)}s
          </span>
        </div>
      </Field>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-soft">
        <Button size="sm" variant={isEditing ? "primary" : "secondary"} onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? "✓ Дуусгах" : "✎ Edit"}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleCopyPrompt}>
          {copied ? "✓ Copied" : "⧉ Copy prompt"}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => regenerateFramePrompt(frame.id)}>
          ↻ Regenerate
        </Button>
        <Button size="sm" variant="danger" onClick={handleDelete} className="ml-auto">
          {confirmDelete ? "Устгах уу?" : "🗑 Delete"}
        </Button>
      </div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft/70 mb-1">
        {label}
      </p>
      {children}
    </div>
  );
}
