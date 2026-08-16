import { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { ChipGroup } from "../common/ChipGroup";
import {
  DEFAULT_IMAGE_MODEL,
  getApiKey,
  getModel,
  getProvider,
  setApiKey,
  setModel,
  setProvider,
  type ImageProvider,
} from "../../lib/imageGen";

const PROVIDER_OPTIONS: { id: ImageProvider; label: string }[] = [
  { id: "sketch", label: "✏️ Энгийн зураг (offline)" },
  { id: "pollinations", label: "🆓 Pollinations (үнэгүй)" },
  { id: "gemini", label: "Google Gemini (key + billing)" },
];

export function ImageApiSettings() {
  const [provider, setProviderState] = useState<ImageProvider>("sketch");
  const [key, setKey] = useState("");
  const [model, setModelInput] = useState(DEFAULT_IMAGE_MODEL);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProviderState(getProvider());
    setKey(getApiKey());
    setModelInput(getModel());
  }, []);

  const handleProviderChange = (next: ImageProvider) => {
    setProviderState(next);
    setProvider(next);
  };

  const handleSave = () => {
    setApiKey(key);
    setModel(model);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Card>
      <p className="text-sm font-semibold text-ink mb-1">🖼 Image generation</p>
      <p className="text-xs text-ink-soft mb-3 leading-relaxed">
        Кадрын preview дээр жинхэнэ зураг гаргах эх сурвалжаа сонгоно уу.
      </p>

      <ChipGroup options={PROVIDER_OPTIONS} value={provider} onChange={handleProviderChange} />

      {provider === "sketch" && (
        <p className="text-xs text-ink-soft mt-3 leading-relaxed">
          Сүлжээ, key, төлбөр огт шаардахгүй — таны төхөөрөмж дээр шууд, шинэ scene-ий
          сэтгэл хөдлөлд тохирсон энгийн pastel line-art зураг зурна. 100% найдвартай, гэхдээ
          жинхэнэ AI зурагтай харьцуулбал энгийн.
        </p>
      )}
      {provider === "pollinations" && (
        <p className="text-xs text-ink-soft mt-3 leading-relaxed">
          Anonymous, үнэгүй, key/карт огт шаардахгүй, гэхдээ гадаад сервистэй сүлжээгээр
          холбогддог тул зарим орчинд (proxy, firewall) ачаалагдахгүй байж болзошгүй.
        </p>
      )}
      {provider === "gemini" && (
        <>
          <p className="text-xs text-ink-soft mt-3 mb-3 leading-relaxed">
            Google AI Studio-гийн API key хэрэгтэй —{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-pink-dark underline"
            >
              aistudio.google.com/apikey
            </a>{" "}
            дээрээс авах боломжтой. Key зөвхөн энэ browser-ийн localStorage-д хадгалагдаж, шууд
            Google руу явна (project JSON export-д ороохгүй) — зөвхөн хувийн/локал ашиглалтад
            тохиромжтой.
          </p>
          <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-3 leading-relaxed">
            ⚠️ Зургийн (image) моделүүдэд free tier-ийн quota ихэвчлэн 0 байдаг тул "429 quota"
            алдаа гарвал Google AI Studio дээрх project-доо billing идэвхжүүлэх шаардлагатай.
          </p>

          <label className="block text-xs font-semibold text-ink mb-1">API key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIza…"
            className="w-full rounded-2xl border border-border-soft bg-white/80 px-4 py-2.5 text-sm text-ink font-mono focus:outline-none focus:ring-2 focus:ring-pink-dark/40 mb-3"
          />

          <label className="block text-xs font-semibold text-ink mb-1">Model (заавал биш)</label>
          <input
            value={model}
            onChange={(e) => setModelInput(e.target.value)}
            placeholder={DEFAULT_IMAGE_MODEL}
            className="w-full rounded-2xl border border-border-soft bg-white/80 px-4 py-2.5 text-sm text-ink font-mono focus:outline-none focus:ring-2 focus:ring-pink-dark/40 mb-3"
          />

          <button
            onClick={handleSave}
            className="text-sm font-medium bg-white/80 border border-border-soft hover:bg-white px-4 py-2 rounded-2xl transition-colors"
          >
            {saved ? "✓ Хадгалагдлаа" : "Хадгалах"}
          </button>
        </>
      )}
    </Card>
  );
}
