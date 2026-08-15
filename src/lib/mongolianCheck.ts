import type { Frame, MongolianCheckIssue, MongolianCheckResult } from "../types";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const SUSPICIOUS_RE = /\{|\}|undefined|null|NaN/;

function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function runMongolianCheck(frames: Frame[]): MongolianCheckResult {
  const issues: MongolianCheckIssue[] = [];
  const seenText = new Map<string, number>();

  frames.forEach((frame) => {
    const text = frame.text.trim();

    if (!text) {
      issues.push({ frameId: frame.id, message: "Дэлгэцийн текст хоосон байна." });
      return;
    }
    if (!CYRILLIC_RE.test(text) && text !== "…") {
      issues.push({ frameId: frame.id, message: "Кирилл монгол текст илэрсэнгүй." });
    }
    if (SUSPICIOUS_RE.test(text)) {
      issues.push({ frameId: frame.id, message: "Боловсруулаагүй утга (placeholder) илэрлээ." });
    }
    if (/ {2,}/.test(text)) {
      issues.push({ frameId: frame.id, message: "Хос зай (double space) байна." });
    }
    const wc = wordCount(text);
    if (wc > 18) {
      issues.push({ frameId: frame.id, message: `Текст хэт урт байна (${wc} үг). 4–18 үг байхыг зөвлөж байна.` });
    }
    const key = text.toLowerCase();
    if (seenText.has(key)) {
      issues.push({
        frameId: frame.id,
        message: `Кадр ${seenText.get(key)}-тэй ижил текст давтагдсан байна.`,
      });
    } else {
      seenText.set(key, frame.id);
    }
  });

  return {
    status: issues.length === 0 ? "pass" : "issues",
    issues,
    checkedAt: Date.now(),
  };
}
