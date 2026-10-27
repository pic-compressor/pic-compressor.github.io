"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export default function Footer() {
  const { locale } = useLocale();
  const isChinese = locale === "zh";

  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div className="footer-brand">
          <strong>Pic Compressor</strong>
          <p>
            {isChinese
              ? "在浏览器中完成的简单图片压缩。"
              : "Simple image compression that runs in your browser."}
          </p>
        </div>
        <nav className="footer-links">
          <Link className="footer-link" href="/privacy-policy">
            {isChinese ? "隐私" : "Privacy"}
          </Link>
          <Link className="footer-link" href="/terms-of-use">
            {isChinese ? "条款" : "Terms"}
          </Link>
          <Link className="footer-link" href="/about">
            {isChinese ? "关于" : "About"}
          </Link>
          <Link className="footer-link" href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
