import { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { DEFAULT_IMAGE_MODEL, getApiKey, getModel, setApiKey, setModel } from "../../lib/imageGen";

export function ImageApiSettings() {
  const [key, setKey] = useState("");
  const [model, setModelInput] = useState(DEFAULT_IMAGE_MODEL);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(getApiKey());
    setModelInput(getModel());
  }, []);

  const handleSave = () => {
    setApiKey(key);
    setModel(model);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Card>
      <p className="text-sm font-semibold text-ink mb-1">🖼 Image generation (Google Gemini)</p>
      <p className="text-xs text-ink-soft mb-3 leading-relaxed">
        Кадрын preview дээр жинхэнэ зураг гаргахын тулд Google AI Studio-гийн API key хэрэгтэй —{" "}
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noreferrer"
          className="text-pink-dark underline"
        >
          aistudio.google.com/apikey
        </a>{" "}
        дээрээс үнэгүй авах боломжтой. Key зөвхөн энэ browser-ийн localStorage-д хадгалагдаж, шууд
        Google руу явна (project JSON export-д ороохгүй) — зөвхөн хувийн/локал ашиглалтад тохиромжтой.
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
    </Card>
  );
}
