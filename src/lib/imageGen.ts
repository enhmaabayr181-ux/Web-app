import type { MainCharacterId, ReelSizeId } from "../types";
import { generateSketch } from "./sketchGen";

const API_KEY_STORAGE = "comic-reel-studio:gemini-api-key";
const MODEL_STORAGE = "comic-reel-studio:gemini-model";
const PROVIDER_STORAGE = "comic-reel-studio:image-provider";

export type ImageProvider = "sketch" | "pollinations" | "gemini";

// Imagen's :predict endpoint (imagen-4.0-generate-001) now 404s for new
// API keys — Google's own error points new accounts at the generateContent
// image models instead. gemini-2.5-flash-image is confirmed live (verified
// against a real key: request succeeds down to the free-tier quota check,
// i.e. no 404/400 — only 429 RESOURCE_EXHAUSTED, and on that account the
// free-tier limit for image models is 0, so it needs billing enabled).
export const DEFAULT_IMAGE_MODEL = "gemini-2.5-flash-image";

const VALID_PROVIDERS: ImageProvider[] = ["sketch", "pollinations", "gemini"];

export function getProvider(): ImageProvider {
  const stored = localStorage.getItem(PROVIDER_STORAGE);
  return (VALID_PROVIDERS as string[]).includes(stored ?? "") ? (stored as ImageProvider) : "sketch";
}

export function setProvider(provider: ImageProvider) {
  if (provider === "sketch") {
    localStorage.removeItem(PROVIDER_STORAGE);
  } else {
    localStorage.setItem(PROVIDER_STORAGE, provider);
  }
}

// Kept separate from the persisted project store (which gets exported to
// project JSON) so an API key never ends up in an exported file.
export function getApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) ?? "";
}

export function setApiKey(key: string) {
  if (key.trim()) {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

export function getModel(): string {
  return localStorage.getItem(MODEL_STORAGE) || DEFAULT_IMAGE_MODEL;
}

export function setModel(model: string) {
  if (model.trim() && model.trim() !== DEFAULT_IMAGE_MODEL) {
    localStorage.setItem(MODEL_STORAGE, model.trim());
  } else {
    localStorage.removeItem(MODEL_STORAGE);
  }
}

function aspectRatioFor(reelSize: ReelSizeId): "9:16" | "1:1" | "3:4" {
  if (reelSize === "1:1") return "1:1";
  if (reelSize === "4:5") return "3:4";
  return "9:16";
}

function pixelSizeFor(reelSize: ReelSizeId): { width: number; height: number } {
  if (reelSize === "1:1") return { width: 1024, height: 1024 };
  if (reelSize === "4:5") return { width: 896, height: 1120 };
  return { width: 768, height: 1365 };
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export class ImageGenError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ImageGenError";
    this.status = status;
  }
}

/**
 * Free, anonymous, no-signup image generation — a public GET endpoint that
 * returns image bytes directly, so the URL itself can be used as an <img
 * src> with no fetch/API-key/billing needed. This is the default provider.
 * A fixed seed (derived from the prompt) keeps "regenerate" producing a
 * different image on request while a re-render of the same frame doesn't
 * silently reroll it.
 */
function pollinationsUrl(prompt: string, reelSize: ReelSizeId, variant = 0): string {
  const { width, height } = pixelSizeFor(reelSize);
  const seed = (hashString(prompt) + variant) % 1_000_000;
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(seed),
    nologo: "true",
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

interface GenerateContentPart {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
}

/**
 * Calls the Gemini API's generateContent endpoint (image-capable model)
 * directly from the browser with a user-supplied API key. There is no
 * backend in this app, so the key only ever lives in this browser's
 * localStorage and is sent straight to Google — the same as pasting it
 * into Postman. Fine for personal/local use; don't ship a build with a
 * real key baked in for a public deployment.
 */
async function generateWithGemini(prompt: string, reelSize: ReelSizeId): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new ImageGenError("Эхлээд Studio хэсэгт Gemini API key-ээ оруулна уу.");
  }
  const model = getModel();

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: aspectRatioFor(reelSize) },
        },
      }),
    },
  );

  if (!res.ok) {
    let message = `Image API алдаа гарлаа (HTTP ${res.status}).`;
    if (res.status === 400) message = "Хүсэлт буруу байна — model нэр эсвэл prompt-оо шалгана уу.";
    if (res.status === 401 || res.status === 403) message = "API key буруу эсвэл хүчингүй байна.";
    if (res.status === 404) message = "Энэ model олдсонгүй — Studio хэсэгт model нэрээ шалгана уу.";
    if (res.status === 429)
      message =
        "Free tier-ийн зургийн quota дууссан байна (ихэвчлэн 0 байдаг) — Google AI Studio дээрээ billing идэвхжүүлэх эсвэл Pollinations (үнэгүй) руу шилжинэ үү.";
    try {
      const body = await res.json();
      const apiMessage = body?.error?.message;
      if (apiMessage) message = apiMessage;
    } catch {
      // response body wasn't JSON — keep the generic message above
    }
    throw new ImageGenError(message, res.status);
  }

  const data = await res.json();
  const parts: GenerateContentPart[] = data?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart?.inlineData?.data) {
    throw new ImageGenError("API-с зураг буцаж ирсэнгүй. Дахин оролдоно уу.");
  }
  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}

export interface GenerateImageOptions {
  emotion: string;
  mainCharacter: MainCharacterId;
  seed: string;
  variant?: number;
}

export async function generateImage(
  prompt: string,
  reelSize: ReelSizeId,
  options: GenerateImageOptions,
): Promise<string> {
  const provider = getProvider();
  if (provider === "gemini") {
    return generateWithGemini(prompt, reelSize);
  }
  if (provider === "pollinations") {
    return pollinationsUrl(prompt, reelSize, options.variant ?? 0);
  }
  return generateSketch(options.emotion, reelSize, options.mainCharacter, options.seed + (options.variant ?? 0));
}
