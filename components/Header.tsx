"use client";

import Link from "next/link";
import { useLocale } from "../components/LocaleProvider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Header() {
  const { locale, setLocale } = useLocale();
  const isChinese = locale === "zh";

  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link href="/" className="brand" aria-label="Pic Compressor home">
          <img src={`/favicon.svg`} alt="" className="brand-mark" />
          <span>Pic Compressor</span>
        </Link>
        <nav
          className="nav-links"
          aria-label={isChinese ? "主导航" : "Main navigation"}
        >
          <Link href="/#compressor" className="nav-link">
            {isChinese ? "图片压缩" : "Compressor"}
          </Link>
          <Link href="/privacy-policy" className="nav-link">
            {isChinese ? "隐私" : "Privacy"}
          </Link>
          <Link href="/terms-of-use" className="nav-link">
            {isChinese ? "条款" : "Terms"}
          </Link>
          <Link href="/about" className="nav-link">
            {isChinese ? "关于" : "About"}
          </Link>
          <Link href="/contact" className="nav-link">
            {isChinese ? "联系" : "Contact"}
          </Link>
        </nav>
        <div className="header-actions">
          <div
            className="header-locale-switcher"
            role="group"
            aria-label={isChinese ? "选择语言" : "Choose language"}
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("zh")}
              aria-pressed={locale === "zh"}
            >
              中文
            </button>
          </div>
          <Link href="/#compressor" className="header-cta">
            {isChinese ? "开始压缩" : "Start compressing"}
          </Link>
        </div>
      </div>
    </header>
  );
}
