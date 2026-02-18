import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import sharp from "sharp";
import fs from "fs/promises";
import JSZip from "jszip";
import { CompressionOptions } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ProcessedFile = {
  name: string;
  buffer: Buffer;
  size: number;
  format: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: true, keepExtensions: true });
    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const options: CompressionOptions = JSON.parse(fields.options?.[0] || "{}");
    const uploadedFiles = (files.images as File[] | undefined) || [];
    const fileArray = Array.isArray(uploadedFiles)
      ? uploadedFiles
      : [uploadedFiles];

    const processedFiles: ProcessedFile[] = [];

    for (const file of fileArray) {
      if (!file || !file.filepath) continue;
      const inputBuffer = await fs.readFile(file.filepath);

      let pipeline = sharp(inputBuffer);
      const metadata = await pipeline.metadata();

      // 缩放
      if (options.maxSide && options.maxSide > 0) {
        const maxSide = options.maxSide;
        const scale = Math.min(
          maxSide / (metadata.width || 1),
          maxSide / (metadata.height || 1),
        );
        if (scale < 1) {
          pipeline = pipeline.resize({
            width: Math.round((metadata.width || 0) * scale),
            height: Math.round((metadata.height || 0) * scale),
            fit: "inside",
            withoutEnlargement: true,
          });
        }
      }

      const outputFormat =
        options.outputFormat === "original"
          ? metadata.format
          : options.outputFormat;

      // 根据输出格式应用不同参数
      if (outputFormat === "png") {
        const pngOptions: sharp.PngOptions = {
          compressionLevel: options.pngLevel || 9,
          palette: options.reduceColors || false,
          quality: options.quality || 80,
        };
        if (options.reduceColors && options.colorDepth === "8") {
          pngOptions.colors = 256;
        }
        pipeline = pipeline.png(pngOptions);
      } else if (outputFormat === "jpeg") {
        pipeline = pipeline.jpeg({ quality: options.quality || 80 });
      } else if (outputFormat === "webp") {
        pipeline = pipeline.webp({
          quality: options.quality || 80,
          alphaQuality: options.quality || 80,
        });
      } else {
        // 保持原格式
        pipeline = pipeline.toFormat(metadata.format || "png");
      }

      const outputBuffer = await pipeline.toBuffer();

      processedFiles.push({
        name: file.originalFilename || "image.png",
        buffer: outputBuffer,
        size: outputBuffer.length,
        format: outputFormat || "png",
      });

      // 清理临时文件
      await fs.unlink(file.filepath);
    }

    // 返回处理结果
    if (processedFiles.length === 1) {
      const { name, buffer, format } = processedFiles[0];
      const ext = format === "jpeg" ? "jpg" : format;
      const newName = name.replace(/\.[^/.]+$/, "") + `-compressed.${ext}`;
      res.setHeader("Content-Type", `image/${format}`);
      res.setHeader("Content-Disposition", `attachment; filename="${newName}"`);
      res.send(buffer);
    } else {
      const zip = new JSZip();
      processedFiles.forEach(({ name, buffer, format }) => {
        const ext = format === "jpeg" ? "jpg" : format;
        const newName = name.replace(/\.[^/.]+$/, "") + `-compressed.${ext}`;
        zip.file(newName, buffer);
      });
      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="compressed-images.zip"',
      );
      res.send(zipBuffer);
    }
  } catch (error: any) {
    console.error("压缩失败:", error);
    res.status(500).json({ error: "压缩失败", details: error.message });
  }
}
