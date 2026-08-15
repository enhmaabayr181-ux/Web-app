import { useState } from "react";
import { Card, SectionTitle } from "../common/Card";
import { Button } from "../common/Button";
import { useProjectStore } from "../../store/useProjectStore";
import { buildSrt, downloadTextFile, srtToString } from "../../lib/srt";
import {
  buildAllPromptsText,
  buildCaptionText,
  buildProjectJson,
  buildScriptText,
} from "../../lib/exportUtils";

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "comic-reel"
  );
}

export function ExportSection() {
  const project = useProjectStore((s) => s.project);
  const settings = useProjectStore((s) => s.settings);
  const [flash, setFlash] = useState<string | null>(null);

  if (!project) return null;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setFlash(key);
      setTimeout(() => setFlash(null), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  const slug = slugify(project.title);

  return (
    <Card>
      <SectionTitle eyebrow="Export" title="Гаргах" description="Комикоо бусад платформ, засварлагч руу шилжүүлэхэд бэлэн формат." />
      <div className="grid sm:grid-cols-2 gap-2.5">
        <Button variant="secondary" onClick={() => copy(buildAllPromptsText(project), "prompts")}>
          {flash === "prompts" ? "✓ Copied" : "⧉ Copy all prompts"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => downloadTextFile(`${slug}-script.txt`, buildScriptText(project))}
        >
          ⬇ Export script .txt
        </Button>
        <Button
          variant="secondary"
          onClick={() => downloadTextFile(`${slug}.srt`, srtToString(buildSrt(project.frames)))}
        >
          ⬇ Download SRT
        </Button>
        <Button variant="secondary" onClick={() => copy(buildCaptionText(project), "caption")}>
          {flash === "caption" ? "✓ Copied" : "⧉ Copy caption"}
        </Button>
        <Button
          variant="secondary"
          className="sm:col-span-2"
          onClick={() =>
            downloadTextFile(`${slug}-project.json`, buildProjectJson(project, settings), "application/json")
          }
        >
          ⬇ Export project JSON
        </Button>
      </div>
    </Card>
  );
}
