import React from "react";
import { CompressionResult } from "@/types";
import { formatFileSize } from "@/utils/fileHelpers";

type Locale = "zh" | "en";

interface ResultCardProps {
  result: CompressionResult;
  locale: Locale;
}

const copy = {
  zh: {
    original: "原始大小",
    compressed: "压缩后",
    savings: "节省",
    failed: "失败",
  },
  en: {
    original: "Original",
    compressed: "Compressed",
    savings: "Savings",
    failed: "Failed",
  },
};

const ResultCard: React.FC<ResultCardProps> = ({ result, locale }) => {
  const t = copy[locale];

  const compressionRatio =
    result.originalSize && result.compressedSize
      ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
      : 0;

  return (
    <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="font-medium text-slate-800">{result.name}</p>
      {result.success ? (
        <div className="mt-2 text-sm text-slate-600">
          <p>
            {t.original}: {formatFileSize(result.originalSize)}
          </p>
          <p>
            {t.compressed}: {formatFileSize(result.compressedSize)}
          </p>
          <p
            className={`font-semibold ${
              compressionRatio > 0 ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {t.savings}: {compressionRatio}%
          </p>
        </div>
      ) : (
        <p className="text-sm text-rose-500">
          {t.failed}: {result.error}
        </p>
      )}
    </div>
  );
};

export default ResultCard;
