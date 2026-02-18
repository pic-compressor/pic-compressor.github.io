import React from "react";
import { formatFileSize } from "@/utils/fileHelpers";

type Locale = "zh" | "en";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onClear: () => void;
  locale: Locale;
}

const copy = {
  zh: {
    empty: "暂未选择文件",
    selected: "已选文件",
    clear: "清空全部",
    remove: "移除",
    fileFallback: "文件",
  },
  en: {
    empty: "No files selected yet.",
    selected: "Selected Files",
    clear: "Clear All",
    remove: "Remove",
    fileFallback: "FILE",
  },
};

const FileList: React.FC<FileListProps> = ({ files, onRemove, onClear, locale }) => {
  const t = copy[locale];

  if (files.length === 0) {
    return <div className="py-8 text-center italic text-slate-500">{t.empty}</div>;
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          {t.selected} ({files.length})
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{formatFileSize(totalSize)}</span>
          <button
            onClick={onClear}
            className="text-sm font-medium text-rose-500 hover:text-rose-700"
          >
            {t.clear}
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li
            key={`${file.name}-${index}`}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-500">
                {formatFileSize(file.size)} ({file.type.split("/")[1]?.toUpperCase() || t.fileFallback})
              </p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="ml-2 rounded px-2 py-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              title={t.remove}
            >
              {t.remove}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
