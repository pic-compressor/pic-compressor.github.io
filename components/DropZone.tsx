import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Locale = "zh" | "en";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  locale: Locale;
}

const copy = {
  zh: {
    tag: "拖拽上传",
    active: "松开即可上传",
    idle: "拖拽图片到这里，或点击选择文件",
    types: "支持 PNG / JPG / GIF / WebP",
  },
  en: {
    tag: "Drag and Drop",
    active: "Release to upload files",
    idle: "Drop images here, or click to browse",
    types: "Supports PNG / JPG / GIF / WebP",
  },
};

const DropZone: React.FC<DropZoneProps> = ({ onFilesAdded, locale }) => {
  const t = copy[locale];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-700">
        {t.tag}
      </div>
      {isDragActive ? (
        <p className="text-lg font-medium text-slate-800">{t.active}</p>
      ) : (
        <>
          <p className="text-lg font-medium text-slate-800">{t.idle}</p>
          <p className="mt-2 text-sm text-slate-500">{t.types}</p>
        </>
      )}
    </div>
  );
};

export default DropZone;
