import { NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";
import { CompressionOptions } from "@/types";

export const runtime = "nodejs";

type ProcessedFile = {
  name: string;
  buffer: Buffer;
  format: string;
};

function buildContentDisposition(filename: string): string {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  const encoded = encodeURIComponent(filename);
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const optionsRaw = formData.get("options");
    const options: CompressionOptions = JSON.parse(
      typeof optionsRaw === "string" ? optionsRaw : "{}",
    );

    const uploadedFiles = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File);

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 },
      );
    }

    const processedFiles: ProcessedFile[] = [];

    for (const file of uploadedFiles) {
      const inputBuffer = Buffer.from(await file.arrayBuffer());
      let pipeline = sharp(inputBuffer);
      const metadata = await pipeline.metadata();

      if (options.maxSide && options.maxSide > 0) {
        const scale = Math.min(
          options.maxSide / (metadata.width || 1),
          options.maxSide / (metadata.height || 1),
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
          ? metadata.format || "png"
          : options.outputFormat;

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
        pipeline = pipeline.toFormat(metadata.format || "png");
      }

      const outputBuffer = await pipeline.toBuffer();
      processedFiles.push({
        name: file.name || "image.png",
        buffer: outputBuffer,
        format: outputFormat || "png",
      });
    }

    if (processedFiles.length === 1) {
      const { name, buffer, format } = processedFiles[0];
      const ext = format === "jpeg" ? "jpg" : format;
      const baseName = name.replace(/\.[^/.]+$/, "");
      const newName = `${baseName}-compressed.${ext}`;

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": `image/${format}`,
          "Content-Disposition": buildContentDisposition(newName),
        },
      });
    }

    const zip = new JSZip();

    for (const { name, buffer, format } of processedFiles) {
      const ext = format === "jpeg" ? "jpg" : format;
      const baseName = name.replace(/\.[^/.]+$/, "");
      const newName = `${baseName}-compressed.${ext}`;
      zip.file(newName, buffer);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": buildContentDisposition("compressed-images.zip"),
      },
    });
  } catch (error: any) {
    console.error("Compression failed:", error);
    return NextResponse.json(
      { error: "Compression failed", details: error.message },
      { status: 500 },
    );
  }
}
