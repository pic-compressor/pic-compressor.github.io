export interface CompressionOptions {
  maxSide: number; // 0表示不缩放
  outputFormat: 'png' | 'jpeg' | 'webp' | 'original';
  quality: number; // 0-100
  pngLevel: number; // 0-9
  reduceColors: boolean;
  colorDepth: '8' | '24' | '32';
}

export interface FileWithPreview extends File {
  preview?: string;
}

export interface CompressionResult {
  name: string;
  originalSize: number;
  compressedSize: number;
  success: boolean;
  error?: string;
}