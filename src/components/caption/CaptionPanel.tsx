import { useState } from "react";
import { Card, SectionTitle } from "../common/Card";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { ExportSection } from "../export/ExportSection";
import { useProjectStore } from "../../store/useProjectStore";

const CAPTION_LABELS: { key: "short" | "relatable" | "emotional"; title: string; hint: string }[] = [
  { key: "short", title: "Богино", hint: "1–2 өгүүлбэр" },
  { key: "relatable", title: "Relatable", hint: "Хүмүүс comment бичмээр" },
  { key: "emotional", title: "Emotional", hint: "Арай мэдрэмжтэй" },
];

export function CaptionPanel() {
  const project = useProjectStore((s) => s.project);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!project) {
    return <EmptyState hint="Caption болон hashtag санал авахын тулд эхлээд комикоо үүсгэнэ үү." />;
  }

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      <SectionTitle eyebrow="Caption Generator" title="Reel caption" description="AI 3 төрлийн caption санал болгож байна." />

      <div className="grid sm:grid-cols-3 gap-4">
        {CAPTION_LABELS.map(({ key, title, hint }) => (
          <Card key={key} className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="text-[11px] text-ink-soft">{hint}</p>
              </div>
              <button
                onClick={() => copy(project.captions[key], key)}
                className="text-xs font-medium text-pink-dark hover:underline shrink-0"
              >
                {copiedKey === key ? "✓ Copied" : "⧉ Copy"}
              </button>
            </div>
            <p className="text-sm text-ink leading-relaxed flex-1">{project.captions[key]}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-ink">Hashtags</p>
          <button
            onClick={() => copy(project.hashtags.join(" "), "hashtags")}
            className="text-xs font-medium text-pink-dark hover:underline"
          >
            {copiedKey === "hashtags" ? "✓ Copied" : "⧉ Copy all"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-lavender-dark bg-lavender/50 px-3 py-1.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-ink mb-2">Ending line</p>
        <p className="text-sm text-ink-soft italic">“{project.ending}”</p>
      </Card>

      <ExportSection />

      <div className="text-center pt-2">
        <Button variant="ghost" size="sm" disabled title="Дараагийн хувилбарт ирнэ">
          🖼 Connect image generation API (coming soon)
        </Button>
      </div>
    </div>
  );
}
