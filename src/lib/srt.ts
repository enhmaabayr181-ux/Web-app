import type { Frame, SrtEntry, TimelineEntry } from "../types";

export function formatTimecode(seconds: number, srt = false): string {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(totalMs / 3600000);
  const m = Math.floor((totalMs % 3600000) / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  if (srt) {
    return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

export function buildTimeline(frames: Frame[]): TimelineEntry[] {
  let cursor = 0;
  return frames.map((frame, idx) => {
    const start = cursor;
    const end = cursor + Math.max(0.1, frame.duration);
    cursor = end;
    return {
      frameId: frame.id,
      index: idx,
      start,
      end,
      label: `Кадр ${idx + 1}`,
    };
  });
}

export function buildSrt(frames: Frame[]): SrtEntry[] {
  const timeline = buildTimeline(frames);
  return timeline.map((entry, idx) => ({
    index: idx + 1,
    start: entry.start,
    end: entry.end,
    text: frames[idx]?.text ?? "",
  }));
}

export function srtToString(entries: SrtEntry[]): string {
  return entries
    .map((e) => `${e.index}\n${formatTimecode(e.start, true)} --> ${formatTimecode(e.end, true)}\n${e.text}\n`)
    .join("\n")
    .trim() + "\n";
}

export function totalDuration(frames: Frame[]): number {
  return frames.reduce((sum, f) => sum + Math.max(0.1, f.duration), 0);
}

export async function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  // window.claude only exists inside the Claude Artifact sandbox, where a
  // plain <a download> link is inert — route through its downloads
  // capability there instead, falling back to it for real browsers.
  const claudeRuntime = (window as unknown as { claude?: { use?: (name: string) => Promise<unknown> } }).claude;
  if (claudeRuntime?.use) {
    try {
      const downloads = (await claudeRuntime.use("downloads")) as
        | { save: (req: { filename: string; data: string }) => Promise<unknown> }
        | null;
      if (downloads) {
        try {
          await downloads.save({ filename, data: content });
          return;
        } catch (err) {
          // Formats outside the sandbox's allowlist (e.g. .srt) still need
          // to reach the viewer — retry once as plain text.
          if ((err as { code?: string })?.code === "rejected_extension" && !filename.endsWith(".txt")) {
            await downloads.save({ filename: filename.replace(/\.[^.]+$/, "") + ".txt", data: content });
          }
          return;
        }
      }
    } catch {
      // capability unavailable — fall through to the blob download below
    }
  }

  const blob = new Blob(["﻿" + content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
