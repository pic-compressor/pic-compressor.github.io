import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pic-compressor.github.io";
  return [
    { url: base, lastModified: new Date() },
    { url: base + "/contact", lastModified: new Date() },
    { url: base + "/privacy-policy", lastModified: new Date() },
    { url: base + "/terms-of-use", lastModified: new Date() },
    { url: base + "/about", lastModified: new Date() },
  ];
}
