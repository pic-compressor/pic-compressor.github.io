"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "../../components/LocaleProvider";

export default function Contact() {
  const { locale } = useLocale();
  const discussionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = discussionRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "pic-compressor/pic-compressor.github.io");
    script.setAttribute("data-repo-id", "R_kgDOUsRJtw");
    script.setAttribute("data-category", "Q&A");
    script.setAttribute("data-category-id", "DIC_kwDOUsRJt84DJtTw");
    script.setAttribute("data-mapping", "title");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("data-lang", locale === "zh" ? "zh-CN" : "en");
    script.crossOrigin = "anonymous";
    script.async = true;
    container.appendChild(script);

    return () => container.replaceChildren();
  }, [locale]);

  const isChinese = locale === "zh";

  return (
    <main className="content-page">
      <article className="content-panel">
        <div>
          <div>
            <span className="mini-label">CONTACT · FEEDBACK</span>
            <h1 className="content-title">{isChinese ? "联系与反馈" : "Contact"}</h1>
            <p className="content-lead">
              {isChinese
                ? "有问题、建议或想分享使用体验？欢迎在下方留言。"
                : "Have a question, suggestion, or feedback? Join the discussion below."}
            </p>
          </div>
        </div>
        <div ref={discussionRef} className="mt-8 min-h-40" />
      </article>
    </main>
  );
}