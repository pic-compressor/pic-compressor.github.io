"use client";

import { useEffect, useMemo, useState } from "react";
import DropZone from "@/components/DropZone";
import FileList from "@/components/FileList";
import Settings from "@/components/Settings";
import ResultCard from "@/components/ResultCard";
import { CompressionOptions, CompressionResult } from "@/types";
import { formatFileSize } from "@/utils/fileHelpers";
import { saveAs } from "file-saver";

type Locale = "zh" | "en";

const defaultSettings: CompressionOptions = {
  maxSide: 0,
  outputFormat: "png",
  quality: 85,
  pngLevel: 9,
  reduceColors: false,
  colorDepth: "32",
};

const STORAGE_KEY = "pic-compressor:settings";
const LOCALE_KEY = "pic-compressor:locale";

const presets: Record<"web" | "quality" | "smallest", CompressionOptions> = {
  web: {
    maxSide: 1600,
    outputFormat: "webp",
    quality: 78,
    pngLevel: 9,
    reduceColors: false,
    colorDepth: "32",
  },
  quality: {
    maxSide: 0,
    outputFormat: "png",
    quality: 92,
    pngLevel: 7,
    reduceColors: false,
    colorDepth: "32",
  },
  smallest: {
    maxSide: 1200,
    outputFormat: "jpeg",
    quality: 65,
    pngLevel: 9,
    reduceColors: true,
    colorDepth: "8",
  },
};

const texts = {
  zh: {
    appTitle: "图片压缩工具",
    appDesc: "支持 PNG/JPG/GIF/WebP，服务端压缩并自动下载。",
    langLabel: "语言",
    selectedFiles: "已选文件",
    totalSize: "总大小",
    status: "状态",
    statusIdle: "空闲",
    statusCompressing: "压缩中...",
    estimateTitle: "压缩前预估",
    estimateOutput: "预计压缩后",
    estimateSaving: "预计节省",
    estimateTip: "提示：预估值基于格式与参数推断，实际结果以压缩输出为准。",
    compressButton: "开始压缩并下载",
    compressingButton: "压缩中...",
    resultsTitle: "压缩结果",
    skipped: (n: number) => `已跳过 ${n} 个重复文件。`,
    doneBatch: "批量压缩完成。",
    doneSingle: "压缩完成。",
    failed: (msg: string) => `压缩失败：${msg}`,
    presetApplied: "已应用预设参数。",
  },
  en: {
    appTitle: "Image Compressor",
    appDesc: "Compress PNG/JPG/GIF/WebP server-side and download instantly.",
    langLabel: "Language",
    selectedFiles: "Selected Files",
    totalSize: "Total Size",
    status: "Status",
    statusIdle: "Idle",
    statusCompressing: "Compressing...",
    estimateTitle: "Pre-Compression Estimate",
    estimateOutput: "Estimated Output",
    estimateSaving: "Estimated Savings",
    estimateTip: "Tip: estimate is calculated from format and settings, actual output may vary.",
    compressButton: "Compress and Download",
    compressingButton: "Compressing...",
    resultsTitle: "Compression Results",
    skipped: (n: number) => `${n} duplicate file(s) were skipped.`,
    doneBatch: "Batch compression completed.",
    doneSingle: "Compression completed.",
    failed: (msg: string) => `Compression failed: ${msg}`,
    presetApplied: "Preset has been applied.",
  },
};

function parseDownloadFilename(contentDisposition: string | null): string {
  if (!contentDisposition) return "compressed.png";
  const encoded = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (encoded?.[1]) {
    try {
      return decodeURIComponent(encoded[1]);
    } catch {
      // ignore malformed value and fall back to filename=
    }
  }
  const basic = contentDisposition.match(/filename="([^"]+)"/i);
  return basic?.[1] ?? "compressed.png";
}

function estimateCompressionRatio(settings: CompressionOptions): number {
  const qualityRatio = Math.min(100, Math.max(10, settings.quality)) / 100;
  let ratio = 1;

  if (settings.outputFormat === "png") {
    ratio = 0.76 - settings.pngLevel * 0.015;
    if (settings.reduceColors) ratio -= 0.16;
    if (settings.colorDepth === "8") ratio -= 0.12;
  } else if (settings.outputFormat === "jpeg") {
    ratio = 0.22 + qualityRatio * 0.68;
  } else if (settings.outputFormat === "webp") {
    ratio = 0.16 + qualityRatio * 0.58;
  } else {
    ratio = 0.95;
  }

  if (settings.maxSide > 0) {
    if (settings.maxSide <= 1200) ratio *= 0.72;
    else if (settings.maxSide <= 2000) ratio *= 0.82;
    else ratio *= 0.9;
  }

  return Math.min(1, Math.max(0.2, ratio));
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [files, setFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [results, setResults] = useState<CompressionResult[]>([]);
  const [settings, setSettings] = useState<CompressionOptions>(defaultSettings);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const t = texts[locale];

  useEffect(() => {
    try {
      const rawSettings = localStorage.getItem(STORAGE_KEY);
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings) as CompressionOptions;
        setSettings({ ...defaultSettings, ...parsed });
      }

      const rawLocale = localStorage.getItem(LOCALE_KEY);
      if (rawLocale === "zh" || rawLocale === "en") {
        setLocale(rawLocale);
      }
    } catch {
      // ignore bad local cache
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale);
  }, [locale]);

  const selectedSummary = useMemo(() => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    return {
      count: files.length,
      totalSize,
    };
  }, [files]);

  const estimatedSummary = useMemo(() => {
    if (selectedSummary.totalSize === 0) {
      return { estimatedSize: 0, savingSize: 0, savingRate: 0 };
    }

    const ratio = estimateCompressionRatio(settings);
    const estimatedSize = Math.max(
      Math.round(selectedSummary.totalSize * ratio),
      files.length * 1024,
    );
    const safeEstimatedSize = Math.min(estimatedSize, selectedSummary.totalSize);
    const savingSize = selectedSummary.totalSize - safeEstimatedSize;
    const savingRate = Math.round((savingSize / selectedSummary.totalSize) * 100);

    return {
      estimatedSize: safeEstimatedSize,
      savingSize,
      savingRate,
    };
  }, [files.length, selectedSummary.totalSize, settings]);

  const handleFilesAdded = (newFiles: File[]) => {
    setErrorMessage("");
    setInfoMessage("");

    setFiles((prev) => {
      const existing = new Set(
        prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
      );

      const unique = newFiles.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (existing.has(key)) return false;
        existing.add(key);
        return true;
      });

      const skipped = newFiles.length - unique.length;
      if (skipped > 0) {
        setInfoMessage(t.skipped(skipped));
      }

      return [...prev, ...unique];
    });

    setResults([]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setResults([]);
    setErrorMessage("");
    setInfoMessage("");
  };

  const startCompression = async () => {
    if (files.length === 0) return;

    setCompressing(true);
    setResults([]);
    setErrorMessage("");
    setInfoMessage("");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("options", JSON.stringify(settings));

    try {
      const res = await fetch("/api/compress", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let details = "Compression failed.";
        try {
          const error = await res.json();
          details = error.details || error.error || details;
        } catch {
          // keep default message
        }
        throw new Error(details);
      }

      const contentType = res.headers.get("content-type");

      if (contentType?.includes("application/zip")) {
        const blob = await res.blob();
        saveAs(blob, "compressed-images.zip");
        const originalSize = files.reduce((sum, file) => sum + file.size, 0);

        setResults([
          {
            name: `${files.length} files`,
            originalSize,
            compressedSize: blob.size,
            success: true,
          },
        ]);
        setInfoMessage(t.doneBatch);
      } else {
        const blob = await res.blob();
        const contentDisposition = res.headers.get("content-disposition");
        const filename = parseDownloadFilename(contentDisposition);

        saveAs(blob, filename);

        setResults([
          {
            name: filename,
            originalSize: files[0]?.size || 0,
            compressedSize: blob.size,
            success: true,
          },
        ]);
        setInfoMessage(t.doneSingle);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(t.failed(error.message));
    } finally {
      setCompressing(false);
    }
  };

  const handlePreset = (preset: "web" | "quality" | "smallest") => {
    setSettings(presets[preset]);
    setInfoMessage(t.presetApplied);
    setErrorMessage("");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section className="hero-panel mb-8 rounded-3xl p-6 md:p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-900 md:text-4xl">
              {t.appTitle}
            </h1>
            <p className="text-slate-700">{t.appDesc}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm">
            <label className="mr-2 text-slate-600">{t.langLabel}</label>
            <button
              className={`lang-btn ${locale === "zh" ? "lang-btn-active" : ""}`}
              onClick={() => setLocale("zh")}
            >
              中文
            </button>
            <button
              className={`lang-btn ml-1 ${locale === "en" ? "lang-btn-active" : ""}`}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="stat-card">
            <p className="stat-label">{t.selectedFiles}</p>
            <p className="stat-value">{selectedSummary.count}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">{t.totalSize}</p>
            <p className="stat-value">{formatFileSize(selectedSummary.totalSize)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">{t.status}</p>
            <p className="stat-value text-lg">
              {compressing ? t.statusCompressing : t.statusIdle}
            </p>
          </div>
        </section>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">{t.estimateTitle}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{t.estimateOutput}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {formatFileSize(estimatedSummary.estimatedSize)}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-700">{t.estimateSaving}</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-700">
              {formatFileSize(estimatedSummary.savingSize)} ({estimatedSummary.savingRate}%)
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${estimatedSummary.savingRate}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">{t.estimateTip}</p>
      </section>

      {infoMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {infoMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <DropZone onFilesAdded={handleFilesAdded} locale={locale} />
        <FileList files={files} onRemove={removeFile} onClear={clearAll} locale={locale} />
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Settings
          settings={settings}
          onChange={setSettings}
          onApplyPreset={handlePreset}
          onReset={() => setSettings(defaultSettings)}
          locale={locale}
        />
        <button
          onClick={startCompression}
          disabled={files.length === 0 || compressing}
          className="btn-primary mt-4 w-full"
        >
          {compressing ? t.compressingButton : t.compressButton}
        </button>
      </div>

      {results.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">{t.resultsTitle}</h2>
          {results.map((result, idx) => (
            <ResultCard key={idx} result={result} locale={locale} />
          ))}
        </div>
      )}
    </main>
  );
}
