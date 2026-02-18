import React from "react";
import { CompressionOptions } from "@/types";

type Locale = "zh" | "en";

interface SettingsProps {
  settings: CompressionOptions;
  onChange: (settings: CompressionOptions) => void;
  onApplyPreset: (preset: "web" | "quality" | "smallest") => void;
  onReset: () => void;
  locale: Locale;
}

const copy = {
  zh: {
    quickPresets: "快捷预设",
    webUpload: "网页上传",
    highQuality: "高质量",
    smallestSize: "极限压缩",
    reset: "重置",
    maxSide: "最大边长（px，0 表示不缩放）",
    outputFormat: "输出格式",
    pngDesc: "PNG（保留透明）",
    jpegDesc: "JPEG（照片体积更小）",
    webpDesc: "WebP（平衡质量与大小）",
    originalDesc: "保持原格式",
    quality: "压缩质量",
    pngLevel: "PNG 压缩级别",
    reduceColors: "启用调色板（减少颜色）",
    colorDepth: "颜色深度",
    depth32: "32位",
    depth24: "24位",
    depth8: "8位（256色）",
  },
  en: {
    quickPresets: "Quick Presets",
    webUpload: "Web Upload",
    highQuality: "High Quality",
    smallestSize: "Smallest Size",
    reset: "Reset",
    maxSide: "Max Side (px, 0 to disable resizing)",
    outputFormat: "Output Format",
    pngDesc: "PNG (supports transparency)",
    jpegDesc: "JPEG (smaller for photos)",
    webpDesc: "WebP (modern balance)",
    originalDesc: "Original format",
    quality: "Quality",
    pngLevel: "PNG Compression Level",
    reduceColors: "Reduce colors (palette mode)",
    colorDepth: "Color Depth",
    depth32: "32-bit",
    depth24: "24-bit",
    depth8: "8-bit (256 colors)",
  },
};

const Settings: React.FC<SettingsProps> = ({
  settings,
  onChange,
  onApplyPreset,
  onReset,
  locale,
}) => {
  const t = copy[locale];

  const handleChange = <K extends keyof CompressionOptions>(
    key: K,
    value: CompressionOptions[K],
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-800">{t.quickPresets}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
          <button type="button" onClick={() => onApplyPreset("web")} className="preset-btn">
            {t.webUpload}
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset("quality")}
            className="preset-btn"
          >
            {t.highQuality}
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset("smallest")}
            className="preset-btn"
          >
            {t.smallestSize}
          </button>
          <button type="button" onClick={onReset} className="preset-btn-muted">
            {t.reset}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t.maxSide}</label>
        <input
          type="number"
          min="0"
          value={settings.maxSide}
          onChange={(e) => handleChange("maxSide", parseInt(e.target.value, 10) || 0)}
          className="field-input"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t.outputFormat}</label>
        <select
          value={settings.outputFormat}
          onChange={(e) =>
            handleChange(
              "outputFormat",
              e.target.value as CompressionOptions["outputFormat"],
            )
          }
          className="field-input"
        >
          <option value="png">{t.pngDesc}</option>
          <option value="jpeg">{t.jpegDesc}</option>
          <option value="webp">{t.webpDesc}</option>
          <option value="original">{t.originalDesc}</option>
        </select>
      </div>

      {settings.outputFormat !== "png" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t.quality} ({settings.quality})
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.quality}
            onChange={(e) => handleChange("quality", parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>
      )}

      {settings.outputFormat === "png" && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t.pngLevel} ({settings.pngLevel})
            </label>
            <input
              type="range"
              min="0"
              max="9"
              value={settings.pngLevel}
              onChange={(e) => handleChange("pngLevel", parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={settings.reduceColors}
              onChange={(e) => handleChange("reduceColors", e.target.checked)}
            />
            {t.reduceColors}
          </label>

          {settings.reduceColors && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t.colorDepth}
              </label>
              <select
                value={settings.colorDepth}
                onChange={(e) =>
                  handleChange(
                    "colorDepth",
                    e.target.value as CompressionOptions["colorDepth"],
                  )
                }
                className="field-input"
              >
                <option value="32">{t.depth32}</option>
                <option value="24">{t.depth24}</option>
                <option value="8">{t.depth8}</option>
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Settings;
