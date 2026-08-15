import type {
  CategoryId,
  EndingType,
  MainCharacterId,
  ReelSizeId,
  StyleId,
  TabId,
  ToneId,
} from "./types";

export const CATEGORY_OPTIONS: { id: CategoryId; label: string }[] = [
  { id: "relationship", label: "Relationship" },
  { id: "red_flag", label: "Red Flag" },
  { id: "green_flag", label: "Green Flag" },
  { id: "funny", label: "Funny" },
  { id: "romantic", label: "Romantic" },
  { id: "life", label: "Life" },
  { id: "girl_thoughts", label: "Girl thoughts" },
  { id: "pov", label: "POV" },
  { id: "motivational", label: "Motivational" },
  { id: "custom", label: "Custom" },
];

export const TONE_OPTIONS: { id: ToneId; label: string }[] = [
  { id: "funny", label: "Хөгжилтэй" },
  { id: "cute", label: "Хөөрхөн" },
  { id: "romantic", label: "Романтик" },
  { id: "bright", label: "Гэгээлэг" },
  { id: "sad", label: "Гунигтай" },
  { id: "dreamy", label: "Dreamy" },
  { id: "emotional", label: "Emotional" },
  { id: "sarcastic", label: "Sarcastic" },
];

export const FRAME_COUNT_OPTIONS = [4, 5, 6, 7, 8];

export const REEL_SIZE_OPTIONS: { id: ReelSizeId; label: string }[] = [
  { id: "9:16", label: "1080 × 1920 — 9:16" },
  { id: "1:1", label: "1080 × 1080 — 1:1" },
  { id: "4:5", label: "1080 × 1350 — 4:5" },
];

export const MAIN_CHARACTER_OPTIONS: { id: MainCharacterId; label: string }[] = [
  { id: "female", label: "Эмэгтэй" },
  { id: "male", label: "Эрэгтэй" },
  { id: "couple", label: "Хос" },
  { id: "custom", label: "Custom" },
];

export const STYLE_OPTIONS: { id: StyleId; label: string }[] = [
  { id: "modern_pastel", label: "Modern pastel comic" },
  { id: "korean_webtoon", label: "Korean webtoon" },
  { id: "watercolor", label: "Soft watercolor" },
  { id: "dreamy_illustration", label: "Dreamy illustration" },
  { id: "cute_editorial", label: "Cute editorial comic" },
  { id: "minimal_comic", label: "Minimal comic" },
  { id: "cinematic_comic", label: "Cinematic comic" },
];

export const ENDING_OPTIONS: { id: EndingType; label: string }[] = [
  { id: "punchline", label: "Punchline" },
  { id: "emotional", label: "Emotional" },
  { id: "question", label: "Question" },
  { id: "no_cta", label: "No CTA" },
];

export const DEFAULT_FRAME_DURATION = 2.8;

export const NAV_ITEMS: { id: TabId; label: string; icon: string }[] = [
  { id: "studio", label: "Studio", icon: "🏠" },
  { id: "frames", label: "Frames", icon: "🎞" },
  { id: "timeline", label: "Timeline", icon: "⏱" },
  { id: "subtitle", label: "Subtitle", icon: "💬" },
  { id: "caption", label: "Caption", icon: "✨" },
];

export const STORAGE_KEY = "comic-reel-studio:project:v1";
