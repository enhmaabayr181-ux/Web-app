import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ComicProject,
  Frame,
  FrameImageState,
  MongolianCheckResult,
  ProjectSettings,
  TabId,
} from "../types";
import {
  DEFAULT_FRAME_DURATION,
  STORAGE_KEY,
} from "../constants";
import { generateComicProject, regenerateFrame, MOCK_GENERATION_DELAY_MS } from "../lib/mockAI";
import { runMongolianCheck } from "../lib/mongolianCheck";
import { generateImage, ImageGenError } from "../lib/imageGen";

export const DEFAULT_SETTINGS: ProjectSettings = {
  topic: "",
  category: "relationship",
  customCategory: "",
  tone: "cute",
  frameCount: 6,
  reelSize: "9:16",
  mainCharacter: "female",
  customCharacter: "",
  style: "modern_pastel",
  characterLock: true,
  endingType: "punchline",
};

interface ProjectState {
  settings: ProjectSettings;
  project: ComicProject | null;
  isGenerating: boolean;
  activeTab: TabId;
  mongolianCheck: MongolianCheckResult;
  imageGenState: Record<number, FrameImageState>;

  setActiveTab: (tab: TabId) => void;
  updateSettings: (patch: Partial<ProjectSettings>) => void;
  generate: () => Promise<void>;
  newProject: () => void;

  updateFrame: (id: number, patch: Partial<Frame>) => void;
  deleteFrame: (id: number) => void;
  moveFrame: (id: number, direction: "up" | "down") => void;
  regenerateFramePrompt: (id: number) => void;
  setFrameDuration: (id: number, duration: number) => void;

  generateFrameImage: (id: number) => Promise<void>;
  generateAllImages: () => Promise<void>;
  reportImageLoadError: (id: number) => void;

  runProofread: () => void;
}

function applyFrameNumbering(frames: Frame[]): Frame[] {
  return frames.map((f, idx) => ({ ...f, id: idx + 1 }));
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      project: null,
      isGenerating: false,
      activeTab: "studio",
      mongolianCheck: { status: "idle", issues: [], checkedAt: null },
      imageGenState: {},

      setActiveTab: (tab) => set({ activeTab: tab }),

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      generate: async () => {
        set({ isGenerating: true });
        const settings = get().settings;
        await new Promise((r) => setTimeout(r, MOCK_GENERATION_DELAY_MS));
        const project = generateComicProject(settings);
        set({
          project,
          isGenerating: false,
          activeTab: "frames",
          mongolianCheck: { status: "idle", issues: [], checkedAt: null },
          imageGenState: {},
        });
        get().runProofread();
      },

      newProject: () =>
        set({
          settings: DEFAULT_SETTINGS,
          project: null,
          activeTab: "studio",
          mongolianCheck: { status: "idle", issues: [], checkedAt: null },
          imageGenState: {},
        }),

      updateFrame: (id, patch) =>
        set((state) => {
          if (!state.project) return state;
          const frames = state.project.frames.map((f) =>
            f.id === id ? { ...f, ...patch } : f,
          );
          return { project: { ...state.project, frames } };
        }),

      deleteFrame: (id) =>
        set((state) => {
          if (!state.project) return state;
          const frames = applyFrameNumbering(
            state.project.frames.filter((f) => f.id !== id),
          );
          return { project: { ...state.project, frames }, imageGenState: {} };
        }),

      moveFrame: (id, direction) =>
        set((state) => {
          if (!state.project) return state;
          const frames = [...state.project.frames];
          const idx = frames.findIndex((f) => f.id === id);
          if (idx === -1) return state;
          const swapWith = direction === "up" ? idx - 1 : idx + 1;
          if (swapWith < 0 || swapWith >= frames.length) return state;
          [frames[idx], frames[swapWith]] = [frames[swapWith], frames[idx]];
          return {
            project: { ...state.project, frames: applyFrameNumbering(frames) },
            imageGenState: {},
          };
        }),

      regenerateFramePrompt: (id) =>
        set((state) => {
          if (!state.project) return state;
          const idx = state.project.frames.findIndex((f) => f.id === id);
          if (idx === -1) return state;
          const fresh = regenerateFrame(state.settings, idx, state.project.frames.length);
          const frames = state.project.frames.map((f) =>
            f.id === id ? { ...f, ...fresh, imageUrl: undefined } : f,
          );
          return { project: { ...state.project, frames } };
        }),

      generateFrameImage: async (id) => {
        const project = get().project;
        const frame = project?.frames.find((f) => f.id === id);
        if (!project || !frame) return;

        set((state) => ({
          imageGenState: { ...state.imageGenState, [id]: { loading: true, error: null } },
        }));

        try {
          const variant = frame.imageUrl ? Date.now() : 0;
          const imageUrl = await generateImage(frame.imagePrompt, get().settings.reelSize, variant);
          set((state) => {
            if (!state.project) return state;
            const frames = state.project.frames.map((f) =>
              f.id === id ? { ...f, imageUrl } : f,
            );
            return {
              project: { ...state.project, frames },
              imageGenState: { ...state.imageGenState, [id]: { loading: false, error: null } },
            };
          });
        } catch (err) {
          const message = err instanceof ImageGenError ? err.message : "Зураг үүсгэхэд алдаа гарлаа.";
          set((state) => ({
            imageGenState: { ...state.imageGenState, [id]: { loading: false, error: message } },
          }));
        }
      },

      generateAllImages: async () => {
        const frames = get().project?.frames ?? [];
        for (const frame of frames) {
          if (!frame.imageUrl) {
            await get().generateFrameImage(frame.id);
          }
        }
      },

      reportImageLoadError: (id) =>
        set((state) => {
          if (!state.project) return state;
          const frames = state.project.frames.map((f) =>
            f.id === id ? { ...f, imageUrl: undefined } : f,
          );
          return {
            project: { ...state.project, frames },
            imageGenState: {
              ...state.imageGenState,
              [id]: { loading: false, error: "Зураг ачаалагдсангүй. Дахин оролдоно уу." },
            },
          };
        }),

      setFrameDuration: (id, duration) =>
        set((state) => {
          if (!state.project) return state;
          const safe = Math.min(10, Math.max(0.5, duration));
          const frames = state.project.frames.map((f) =>
            f.id === id ? { ...f, duration: safe } : f,
          );
          return { project: { ...state.project, frames } };
        }),

      runProofread: () => {
        const project = get().project;
        if (!project) return;
        set({ mongolianCheck: { status: "checking", issues: [], checkedAt: null } });
        setTimeout(() => {
          const project2 = get().project;
          if (!project2) return;
          set({ mongolianCheck: runMongolianCheck(project2.frames) });
        }, 500);
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        settings: state.settings,
        project: state.project,
        activeTab: state.activeTab,
        mongolianCheck: state.mongolianCheck,
      }),
    },
  ),
);

export const DEFAULT_DURATION = DEFAULT_FRAME_DURATION;
