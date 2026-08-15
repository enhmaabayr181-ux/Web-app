import { useState } from "react";
import { Card, SectionTitle } from "../common/Card";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { useProjectStore } from "../../store/useProjectStore";
import { buildSrt, downloadTextFile, formatTimecode, srtToString } from "../../lib/srt";

export function SubtitlePanel() {
  const project = useProjectStore((s) => s.project);
  const [copied, setCopied] = useState(false);

  if (!project) {
    return <EmptyState hint="SRT хадмал харахын тулд эхлээд комикоо үүсгэнэ үү." />;
  }

  const entries = buildSrt(project.frames);
  const srtText = srtToString(entries);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(srtText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  const handleDownload = () => {
    const filename = `${slugify(project.title) || "comic-reel"}.srt`;
    downloadTextFile(filename, srtText);
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      <SectionTitle
        eyebrow="SRT Generator"
        title="Хадмал (Subtitle)"
        description="Монгол кирилл Unicode бүрэн дэмждэг, UTF-8 encoding-той .srt файл."
        action={
          <div className="hidden sm:flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleCopy}>
              {copied ? "✓ Copied" : "⧉ Copy SRT"}
            </Button>
            <Button size="sm" variant="primary" onClick={handleDownload}>
              ⬇ Download .srt
            </Button>
          </div>
        }
      />

      <Card>
        <pre className="whitespace-pre-wrap break-words text-sm text-ink font-mono leading-relaxed max-h-[60vh] overflow-y-auto">
          {entries
            .map(
              (e) =>
                `${e.index}\n${formatTimecode(e.start, true)} --> ${formatTimecode(e.end, true)}\n${e.text}\n`,
            )
            .join("\n")}
        </pre>
      </Card>

      <div className="flex sm:hidden gap-2">
        <Button variant="secondary" fullWidth onClick={handleCopy}>
          {copied ? "✓ Copied" : "⧉ Copy SRT"}
        </Button>
        <Button variant="primary" fullWidth onClick={handleDownload}>
          ⬇ Download .srt
        </Button>
      </div>
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
