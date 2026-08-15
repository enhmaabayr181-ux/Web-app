export type CategoryId =
  | "relationship"
  | "red_flag"
  | "green_flag"
  | "funny"
  | "romantic"
  | "life"
  | "girl_thoughts"
  | "pov"
  | "motivational"
  | "custom";

export type ToneId =
  | "funny"
  | "cute"
  | "romantic"
  | "bright"
  | "sad"
  | "dreamy"
  | "emotional"
  | "sarcastic";

export type StyleId =
  | "modern_pastel"
  | "korean_webtoon"
  | "watercolor"
  | "dreamy_illustration"
  | "cute_editorial"
  | "minimal_comic"
  | "cinematic_comic";

export type MainCharacterId = "female" | "male" | "couple" | "custom";

export type EndingType = "punchline" | "emotional" | "question" | "no_cta";

export type ReelSizeId = "9:16" | "1:1" | "4:5";

export interface ProjectSettings {
  topic: string;
  category: CategoryId;
  customCategory: string;
  tone: ToneId;
  frameCount: number;
  reelSize: ReelSizeId;
  mainCharacter: MainCharacterId;
  customCharacter: string;
  style: StyleId;
  characterLock: boolean;
  endingType: EndingType;
}

export interface Frame {
  id: number;
  text: string;
  scene: string;
  emotion: string;
  imagePrompt: string;
  duration: number;
}

export interface CaptionSet {
  short: string;
  relatable: string;
  emotional: string;
}

export interface ComicProject {
  title: string;
  hook: string;
  character: string;
  frames: Frame[];
  ending: string;
  captions: CaptionSet;
  hashtags: string[];
}

export interface TimelineEntry {
  frameId: number;
  index: number;
  start: number;
  end: number;
  label: string;
}

export interface SrtEntry {
  index: number;
  start: number;
  end: number;
  text: string;
}

export type MongolianCheckStatus = "idle" | "checking" | "pass" | "issues";

export interface MongolianCheckIssue {
  frameId: number;
  message: string;
}

export interface MongolianCheckResult {
  status: MongolianCheckStatus;
  issues: MongolianCheckIssue[];
  checkedAt: number | null;
}

export type TabId = "studio" | "frames" | "timeline" | "subtitle" | "caption";
