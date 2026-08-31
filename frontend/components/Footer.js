"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <Link href="/" className="footer-brand">
            <svg className="footer-logo-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 22 2c-2.48 5-3 6.5-4.1 12.2A7 7 0 0 1 11 20z"></path>
              <path d="M9 22v-4h4v4"></path>
              <path d="M22 2L11 13"></path>
            </svg>
            <span>Kisan<span style={{ fontWeight: "700" }}>Connect</span></span>
          </Link>
          <span className="footer-credit">{t.footerText}</span>
        </div>
        <div className="footer-right">
          <a href="#" onClick={(e) => e.preventDefault()}>{t.aboutUs}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t.support}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t.privacyPolicy}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t.terms}</a>
        </div>
      </div>
    </footer>
  );
}
