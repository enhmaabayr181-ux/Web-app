import type { ComicProject, ProjectSettings } from "../types";
import { buildSrt, srtToString } from "./srt";

export function buildScriptText(project: ComicProject): string {
  const lines: string[] = [];
  lines.push(project.title);
  lines.push("");
  lines.push(`Hook: ${project.hook}`);
  lines.push("");
  lines.push(`Character: ${project.character}`);
  lines.push("");
  project.frames.forEach((frame, idx) => {
    lines.push(`Кадр ${idx + 1}`);
    lines.push(`Дэлгэцийн текст: ${frame.text}`);
    lines.push(`Үйл явдал: ${frame.scene}`);
    lines.push(`Emotion: ${frame.emotion}`);
    lines.push(`Image prompt: ${frame.imagePrompt}`);
    lines.push(`Duration: ${frame.duration.toFixed(1)}s`);
    lines.push("");
  });
  lines.push(`Ending: ${project.ending}`);
  lines.push("");
  lines.push("Captions:");
  lines.push(`  Богино: ${project.captions.short}`);
  lines.push(`  Relatable: ${project.captions.relatable}`);
  lines.push(`  Emotional: ${project.captions.emotional}`);
  lines.push("");
  lines.push(`Hashtags: ${project.hashtags.join(" ")}`);
  return lines.join("\n");
}

export function buildAllPromptsText(project: ComicProject): string {
  return project.frames
    .map((f, idx) => `Кадр ${idx + 1}:\n${f.imagePrompt}`)
    .join("\n\n");
}

export function buildCaptionText(project: ComicProject): string {
  return [
    `Богино:\n${project.captions.short}`,
    `Relatable:\n${project.captions.relatable}`,
    `Emotional:\n${project.captions.emotional}`,
    `Hashtags:\n${project.hashtags.join(" ")}`,
  ].join("\n\n");
}

export function buildProjectJson(project: ComicProject, settings: ProjectSettings): string {
  const srt = srtToString(buildSrt(project.frames));
  return JSON.stringify(
    {
      title: project.title,
      hook: project.hook,
      character: project.character,
      frames: project.frames,
      ending: project.ending,
      captions: project.captions,
      hashtags: project.hashtags,
      settings,
      srt,
    },
    null,
    2,
  );
}
