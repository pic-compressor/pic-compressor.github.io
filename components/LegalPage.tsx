"use client";

import { useEffect } from "react";
import { useLocale } from "./LocaleProvider";

type Locale = "zh" | "en";
type PageKey = "privacy" | "terms" | "about";
type Section = { heading: string; paragraphs?: string[]; items?: string[] };
type PageContent = {
  eyebrow: string;
  title: string;
  lead: string;
  sections: Section[];
  updated: string;
};

const pages: Record<Locale, Record<PageKey, PageContent>> = {
  en: {
    privacy: {
      eyebrow: "LEGAL · PRIVACY",
      title: "Privacy Policy",
      lead: "Pic Compressor is designed so that normal image compression can happen directly in your browser.",
      sections: [
        { heading: "Images and files", paragraphs: ["The compressor processes selected image files locally in your browser. The compression workflow does not require uploading those images to a Pic Compressor server."] },
        { heading: "Information you provide", paragraphs: ["No account, name, email address, or mailing address is required. File names, image data, and compression settings used by the tool are handled by your browser while you use the page."] },
        { heading: "Local storage", paragraphs: ["The site may store preferences such as language and compression settings in your browser's local storage so the interface can remember your choices."] },
        { heading: "Analytics and third parties", paragraphs: ["If analytics, advertising, or other third-party services are enabled, those services may process standard technical or usage information according to their own policies. Such services are separate from browser-side compression.", "The contact page uses Giscus, which is powered by GitHub Discussions. If you post a comment, GitHub may associate it with your GitHub account and process it under its own privacy policy and terms."] },
        { heading: "Changes", paragraphs: ["This policy may be updated when the website, analytics, advertising, or processing features change."] },
      ],
      updated: "Last updated: September 2026",
    },
    terms: {
      eyebrow: "LEGAL · TERMS",
      title: "Terms of Use",
      lead: "These terms explain the basic conditions for using Pic Compressor and its browser-based image processing tools.",
      sections: [
        { heading: "Using the service", paragraphs: ["Pic Compressor is a general-purpose image utility. You are responsible for the files you choose to process and for having the necessary rights to use those files."] },
        { heading: "Processing results", paragraphs: ["Compression results depend on the source image, dimensions, format, browser, and selected settings. We do not guarantee a particular file size, quality level, or compatibility outcome."] },
        { heading: "Acceptable use", paragraphs: ["You agree not to use the website for unlawful activity, abuse, automated activity that disrupts the service, or content you are not authorized to process."] },
        { heading: "Availability", paragraphs: ["The website is provided on an as-available basis. Features may change, be improved, or be removed as the project evolves."] },
        { heading: "Changes", paragraphs: ["These terms may be updated when the website or its functionality changes. Continued use means you are using the current version."] },
      ],
      updated: "Last updated: September 2026",
    },
    about: {
      eyebrow: "ABOUT · PIC COMPRESSOR",
      title: "About Pic Compressor",
      lead: "A lightweight image utility focused on everyday compression without forcing users through an upload workflow.",
      sections: [
        { heading: "Our approach", paragraphs: ["Choose images, configure the output, process them in your browser, and download the results. The interface is designed to keep common image tasks short and predictable."] },
        { heading: "Local-first processing", paragraphs: ["The compressor uses browser-side image processing. In normal use, selected image files are not uploaded to a Pic Compressor application server for compression."] },
        { heading: "Supported formats", items: ["JPG / JPEG for common photographic images.", "PNG when transparency or lossless output is useful.", "WebP for compact web-oriented output.", "GIF files are accepted where supported by the browser processing library."] },
        { heading: "Future tools", paragraphs: ["The project may expand into additional browser-based image utilities while keeping the same lightweight, local-first approach."] },
      ],
      updated: "Last updated: September 2026",
    },
  },
  zh: {
    privacy: {
      eyebrow: "法律 · 隐私",
      title: "隐私政策",
      lead: "Pic Compressor 旨在让图片压缩直接在浏览器中完成。",
      sections: [
        { heading: "图片与文件", paragraphs: ["压缩工具会在浏览器本地处理你选择的图片，正常压缩流程不需要将图片上传到 Pic Compressor 服务器。"] },
        { heading: "你提供的信息", paragraphs: ["使用图片压缩功能无需注册账号或提供联系方式。使用期间，文件名、图片数据和压缩设置由浏览器处理。"] },
        { heading: "本地存储", paragraphs: ["网站会在浏览器本地存储语言、压缩设置等偏好，以便记住你的选择。"] },
        { heading: "第三方服务", paragraphs: ["如果启用了分析、广告或其他第三方服务，这些服务可能会按照各自的政策处理常规技术信息或使用信息。它们与浏览器本地压缩流程相互独立。", "联系页面使用由 GitHub Discussions 提供支持的 Giscus 留言功能。发表评论时，GitHub 可能会将评论与 GitHub 账号关联，并依据其隐私政策和服务条款进行处理。"] },
        { heading: "政策更新", paragraphs: ["网站或功能发生变化时，本政策可能随之更新。"] },
      ],
      updated: "最后更新：2026 年 9 月",
    },
    terms: {
      eyebrow: "法律 · 条款",
      title: "使用条款",
      lead: "本条款说明使用 Pic Compressor 及其浏览器图片处理工具的基本条件。",
      sections: [
        { heading: "服务使用", paragraphs: ["Pic Compressor 是通用图片工具。你需要对自己选择处理的文件负责，并确保拥有使用这些文件所需的权利。"] },
        { heading: "处理结果", paragraphs: ["处理结果取决于源图片、尺寸、格式、浏览器和所选设置。我们不保证特定的文件大小、质量或兼容性结果。"] },
        { heading: "合理使用", paragraphs: ["你不得将本网站用于违法活动、滥用行为、干扰服务的自动化操作，或处理你无权使用的内容。"] },
        { heading: "服务可用性", paragraphs: ["本网站按当前可用状态提供。随着项目发展，功能可能发生变化、改进或移除。"] },
        { heading: "条款更新", paragraphs: ["网站或其功能发生变化时，本条款可能更新。继续使用即表示你使用的是当前版本。"] },
      ],
      updated: "最后更新：2026 年 9 月",
    },
    about: {
      eyebrow: "关于 · PIC COMPRESSOR",
      title: "关于 Pic Compressor",
      lead: "一款轻量级图片工具，专注于日常压缩，无需先把图片上传到服务器。",
      sections: [
        { heading: "产品理念", paragraphs: ["选择图片、设置输出参数、在浏览器中处理，然后下载结果。界面旨在让常见图片操作简单而直接。"] },
        { heading: "本地优先处理", paragraphs: ["压缩工具使用浏览器端图片处理。正常使用时，所选图片不会上传到 Pic Compressor 应用服务器进行压缩。"] },
        { heading: "支持的格式", items: ["JPG / JPEG：常见照片格式。", "PNG：适用于透明背景或无损输出。", "WebP：适用于体积更小的网页图片。", "GIF：浏览器处理库支持时可接受此格式。"] },
        { heading: "后续工具", paragraphs: ["项目可能会增加更多浏览器端图片工具，同时保持轻量和本地优先的处理方式。"] },
      ],
      updated: "最后更新：2026 年 9 月",
    },
  },
};

export default function LegalPage({ page }: { page: PageKey }) {
  const { locale } = useLocale();
  const content = pages[locale][page];

  useEffect(() => {
    document.title = `${content.title} | Pic Compressor`;
  }, [content.title]);

  return (
    <main className="content-page">
      <article className="content-panel">
        <span className="mini-label">{content.eyebrow}</span>
        <h1 className="content-title">{content.title}</h1>
        <p className="content-lead">{content.lead}</p>
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="content-subtitle">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p className="content-text" key={paragraph}>
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="content-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <p className="content-meta">{content.updated}</p>
      </article>
    </main>
  );
}