import { useState } from "react";
import { Card, SectionTitle } from "../common/Card";
import { ChipGroup } from "../common/ChipGroup";
import { Toggle } from "../common/Toggle";
import { Button } from "../common/Button";
import { useProjectStore } from "../../store/useProjectStore";
import {
  CATEGORY_OPTIONS,
  ENDING_OPTIONS,
  FRAME_COUNT_OPTIONS,
  MAIN_CHARACTER_OPTIONS,
  REEL_SIZE_OPTIONS,
  STYLE_OPTIONS,
  TONE_OPTIONS,
} from "../../constants";

const PLACEHOLDER =
  "Жишээ: Хариу бичихгүй удахаар нь өөрөө мянган юм бодчихдог…";

export function StudioPanel() {
  const settings = useProjectStore((s) => s.settings);
  const updateSettings = useProjectStore((s) => s.updateSettings);
  const generate = useProjectStore((s) => s.generate);
  const isGenerating = useProjectStore((s) => s.isGenerating);
  const [touched, setTouched] = useState(false);

  const canGenerate = settings.topic.trim().length > 0;

  const handleGenerate = () => {
    setTouched(true);
    if (!canGenerate || isGenerating) return;
    void generate();
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="pt-2 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          Comic Reel Studio
        </h1>
        <p className="text-ink-soft mt-1 text-sm sm:text-base">
          Санаагаа бич. Комик Reel-ээ бэлэн болго.
        </p>
      </div>

      <Card>
        <label className="block text-sm font-semibold text-ink mb-2">
          Комикийн сэдэв / санаа
        </label>
        <textarea
          value={settings.topic}
          onChange={(e) => updateSettings({ topic: e.target.value })}
          placeholder={PLACEHOLDER}
          rows={4}
          className="w-full resize-none rounded-2xl border border-border-soft bg-white/80 px-4 py-3 text-sm sm:text-base text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-pink-dark/40 transition-shadow"
        />
        {touched && !canGenerate && (
          <p className="text-xs text-rose-500 mt-1.5">Сэдэв эсвэл санаагаа бичнэ үү.</p>
        )}
      </Card>

      <Card>
        <p className="text-sm font-semibold text-ink mb-3">Төрөл</p>
        <ChipGroup
          options={CATEGORY_OPTIONS}
          value={settings.category}
          onChange={(category) => updateSettings({ category })}
        />
        {settings.category === "custom" && (
          <input
            value={settings.customCategory}
            onChange={(e) => updateSettings({ customCategory: e.target.value })}
            placeholder="Өөрийн төрлийг бичнэ үү…"
            className="mt-3 w-full rounded-2xl border border-border-soft bg-white/80 px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pink-dark/40"
          />
        )}
      </Card>

      <Card>
        <p className="text-sm font-semibold text-ink mb-3">Өнгө аяс</p>
        <ChipGroup
          options={TONE_OPTIONS}
          value={settings.tone}
          onChange={(tone) => updateSettings({ tone })}
        />
      </Card>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card>
          <p className="text-sm font-semibold text-ink mb-3">Кадрын тоо</p>
          <ChipGroup
            options={FRAME_COUNT_OPTIONS.map((n) => ({ id: n, label: String(n) }))}
            value={settings.frameCount}
            onChange={(frameCount) => updateSettings({ frameCount })}
          />
        </Card>

        <Card>
          <p className="text-sm font-semibold text-ink mb-3">Reel хэмжээ</p>
          <ChipGroup
            options={REEL_SIZE_OPTIONS}
            value={settings.reelSize}
            onChange={(reelSize) => updateSettings({ reelSize })}
          />
        </Card>
      </div>

      <Card>
        <SectionTitle eyebrow="Character consistency" title="Дүрийн тохиргоо" />

        <p className="text-sm font-semibold text-ink mb-3">Гол дүр</p>
        <ChipGroup
          options={MAIN_CHARACTER_OPTIONS}
          value={settings.mainCharacter}
          onChange={(mainCharacter) => updateSettings({ mainCharacter })}
        />
        {settings.mainCharacter === "custom" && (
          <textarea
            value={settings.customCharacter}
            onChange={(e) => updateSettings({ customCharacter: e.target.value })}
            placeholder="Дүрийнхээ дүрслэлийг бичнэ үү (жишээ: Same young woman, long black hair, round glasses...)"
            rows={2}
            className="mt-3 w-full resize-none rounded-2xl border border-border-soft bg-white/80 px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pink-dark/40"
          />
        )}

        <p className="text-sm font-semibold text-ink mt-5 mb-3">Style</p>
        <ChipGroup
          options={STYLE_OPTIONS}
          value={settings.style}
          onChange={(style) => updateSettings({ style })}
        />

        <div className="mt-5">
          <Toggle
            checked={settings.characterLock}
            onChange={(characterLock) => updateSettings({ characterLock })}
            label="🔒 Дүрээ бүх кадарт ижил байлгах"
          />
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-ink mb-3">Төгсгөл (Ending)</p>
        <ChipGroup
          options={ENDING_OPTIONS}
          value={settings.endingType}
          onChange={(endingType) => updateSettings({ endingType })}
        />
      </Card>

      <div className="sticky bottom-20 lg:bottom-4 z-10 pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleGenerate}
          disabled={isGenerating}
          className="shadow-xl"
        >
          {isGenerating ? (
            <>
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Үүсгэж байна…
            </>
          ) : (
            "✨ Комик үүсгэх"
          )}
        </Button>
      </div>
    </div>
  );
}
