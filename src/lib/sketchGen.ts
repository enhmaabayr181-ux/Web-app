import type { MainCharacterId, ReelSizeId } from "../types";

type Mood = "happy" | "sad" | "shocked" | "annoyed" | "neutral";

const MOOD_KEYWORDS: Record<Mood, string[]> = {
  happy: [
    "hope", "cute", "warm", "love", "joy", "relief", "proud", "grateful",
    "amused", "satisfied", "excited", "touched", "comforted", "calm",
    "triumphant", "encouraging", "supportive", "empowering", "reassuring",
    "inspiring", "steady", "clarity", "closure",
  ],
  sad: [
    "heavy", "hurt", "worried", "tired", "overwhelmed", "doubt", "guilt",
    "bittersweet", "reflective", "despair",
  ],
  shocked: ["shock", "surprise", "sudden", "tension", "fear"],
  annoyed: [
    "impatient", "suspicious", "defensive", "anxious", "conflict", "fail",
    "sarcastic",
  ],
  neutral: [],
};

function detectMood(emotion: string): Mood {
  const lower = emotion.toLowerCase();
  for (const mood of ["shocked", "happy", "sad", "annoyed"] as Mood[]) {
    if (MOOD_KEYWORDS[mood].some((kw) => lower.includes(kw))) return mood;
  }
  return "neutral";
}

function faceSvg(cx: number, cy: number, r: number, mood: Mood, hair: "long" | "short"): string {
  const ink = "#382f47";
  const eyeY = cy - r * 0.1;
  const eyeDx = r * 0.32;
  const eyeR = r * 0.06;

  let mouth: string;
  let brows: string;
  switch (mood) {
    case "happy":
      mouth = `M ${cx - r * 0.28} ${cy + r * 0.25} Q ${cx} ${cy + r * 0.55} ${cx + r * 0.28} ${cy + r * 0.25}`;
      brows = `M ${cx - eyeDx - r * 0.12} ${eyeY - r * 0.22} Q ${cx - eyeDx} ${eyeY - r * 0.3} ${cx - eyeDx + r * 0.12} ${eyeY - r * 0.22} M ${cx + eyeDx - r * 0.12} ${eyeY - r * 0.22} Q ${cx + eyeDx} ${eyeY - r * 0.3} ${cx + eyeDx + r * 0.12} ${eyeY - r * 0.22}`;
      break;
    case "sad":
      mouth = `M ${cx - r * 0.24} ${cy + r * 0.42} Q ${cx} ${cy + r * 0.22} ${cx + r * 0.24} ${cy + r * 0.42}`;
      brows = `M ${cx - eyeDx - r * 0.14} ${eyeY - r * 0.16} L ${cx - eyeDx + r * 0.14} ${eyeY - r * 0.28} M ${cx + eyeDx + r * 0.14} ${eyeY - r * 0.16} L ${cx + eyeDx - r * 0.14} ${eyeY - r * 0.28}`;
      break;
    case "shocked":
      mouth = `M ${cx} ${cy + r * 0.32} m -${r * 0.12},0 a ${r * 0.12},${r * 0.14} 0 1,0 ${r * 0.24},0 a ${r * 0.12},${r * 0.14} 0 1,0 -${r * 0.24},0`;
      brows = `M ${cx - eyeDx - r * 0.14} ${eyeY - r * 0.32} L ${cx - eyeDx + r * 0.14} ${eyeY - r * 0.34} M ${cx + eyeDx + r * 0.14} ${eyeY - r * 0.32} L ${cx + eyeDx - r * 0.14} ${eyeY - r * 0.34}`;
      break;
    case "annoyed":
      mouth = `M ${cx - r * 0.24} ${cy + r * 0.34} L ${cx + r * 0.24} ${cy + r * 0.34}`;
      brows = `M ${cx - eyeDx - r * 0.14} ${eyeY - r * 0.14} L ${cx - eyeDx + r * 0.14} ${eyeY - r * 0.26} M ${cx + eyeDx + r * 0.14} ${eyeY - r * 0.14} L ${cx + eyeDx - r * 0.14} ${eyeY - r * 0.26}`;
      break;
    default:
      mouth = `M ${cx - r * 0.2} ${cy + r * 0.32} Q ${cx} ${cy + r * 0.4} ${cx + r * 0.2} ${cy + r * 0.32}`;
      brows = `M ${cx - eyeDx - r * 0.12} ${eyeY - r * 0.24} L ${cx - eyeDx + r * 0.12} ${eyeY - r * 0.24} M ${cx + eyeDx - r * 0.12} ${eyeY - r * 0.24} L ${cx + eyeDx + r * 0.12} ${eyeY - r * 0.24}`;
  }

  const hairPath =
    hair === "long"
      ? `M ${cx - r * 1.02} ${cy - r * 0.1}
         C ${cx - r * 1.1} ${cy - r * 1.05} ${cx - r * 0.55} ${cy - r * 1.35} ${cx} ${cy - r * 1.32}
         C ${cx + r * 0.55} ${cy - r * 1.35} ${cx + r * 1.1} ${cy - r * 1.05} ${cx + r * 1.02} ${cy - r * 0.1}
         C ${cx + r * 0.95} ${cy + r * 0.55} ${cx + r * 0.85} ${cy + r * 0.85} ${cx + r * 0.85} ${cy + r * 0.85}
         L ${cx + r * 0.7} ${cy + r * 0.15}
         C ${cx + r * 0.7} ${cy - r * 0.55} ${cx + r * 0.3} ${cy - r * 0.85} ${cx} ${cy - r * 0.85}
         C ${cx - r * 0.3} ${cy - r * 0.85} ${cx - r * 0.7} ${cy - r * 0.55} ${cx - r * 0.7} ${cy + r * 0.15}
         L ${cx - r * 0.85} ${cy + r * 0.85}
         C ${cx - r * 0.85} ${cy + r * 0.85} ${cx - r * 0.95} ${cy + r * 0.55} ${cx - r * 1.02} ${cy - r * 0.1} Z`
      : `M ${cx - r * 1.02} ${cy - r * 0.15}
         C ${cx - r * 1.08} ${cy - r * 1.0} ${cx - r * 0.5} ${cy - r * 1.3} ${cx} ${cy - r * 1.28}
         C ${cx + r * 0.5} ${cy - r * 1.3} ${cx + r * 1.08} ${cy - r * 1.0} ${cx + r * 1.02} ${cy - r * 0.15}
         C ${cx + r * 1.0} ${cy - r * 0.35} ${cx + r * 0.55} ${cy - r * 0.7} ${cx} ${cy - r * 0.72}
         C ${cx - r * 0.55} ${cy - r * 0.7} ${cx - r * 1.0} ${cy - r * 0.35} ${cx - r * 1.02} ${cy - r * 0.15} Z`;

  return `
    <path d="${hairPath}" fill="${ink}" opacity="0.88" />
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fef6ee" stroke="${ink}" stroke-width="${r * 0.045}" />
    <circle cx="${cx - eyeDx}" cy="${eyeY}" r="${eyeR}" fill="${ink}" />
    <circle cx="${cx + eyeDx}" cy="${eyeY}" r="${eyeR}" fill="${ink}" />
    <path d="${brows}" stroke="${ink}" stroke-width="${r * 0.045}" fill="none" stroke-linecap="round" />
    <path d="${mouth}" stroke="${ink}" stroke-width="${r * 0.05}" fill="none" stroke-linecap="round" />
    <circle cx="${cx - eyeDx - r * 0.02}" cy="${cy + r * 0.06}" r="${r * 0.09}" fill="#f6a6c1" opacity="0.5" />
    <circle cx="${cx + eyeDx + r * 0.02}" cy="${cy + r * 0.06}" r="${r * 0.09}" fill="#f6a6c1" opacity="0.5" />
  `;
}

function pixelSizeFor(reelSize: ReelSizeId): { width: number; height: number } {
  if (reelSize === "1:1") return { width: 800, height: 800 };
  if (reelSize === "4:5") return { width: 800, height: 1000 };
  return { width: 720, height: 1280 };
}

const BG_GRADIENTS = [
  ["#ffd9c4", "#ffd3e2"],
  ["#ffd3e2", "#e3ddfb"],
  ["#e3ddfb", "#ffd9c4"],
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Draws a simple pastel line-art "sketch" placeholder entirely client-side —
 * no network call, no API key, so it always works. Used as the default
 * image provider; Pollinations/Gemini remain available as opt-in
 * alternatives for real AI-generated art.
 */
export function generateSketch(
  emotion: string,
  reelSize: ReelSizeId,
  mainCharacter: MainCharacterId,
  seed: string,
): string {
  const { width, height } = pixelSizeFor(reelSize);
  const mood = detectMood(emotion);
  const [c1, c2] = BG_GRADIENTS[hashString(seed) % BG_GRADIENTS.length];
  const gradId = `g${hashString(seed)}`;

  const cx = width / 2;
  const cy = height * 0.42;
  const r = Math.min(width, height) * 0.22;

  const faces =
    mainCharacter === "couple"
      ? faceSvg(cx - r * 1.15, cy, r * 0.85, mood, "long") +
        faceSvg(cx + r * 1.15, cy, r * 0.85, mood, "short")
      : faceSvg(cx, cy, r, mood, mainCharacter === "male" ? "short" : "long");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#${gradId})" />
    <circle cx="${width * 0.15}" cy="${height * 0.85}" r="${width * 0.18}" fill="white" opacity="0.18" />
    <circle cx="${width * 0.88}" cy="${height * 0.12}" r="${width * 0.12}" fill="white" opacity="0.18" />
    ${faces}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
