"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 64);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-ink/10 bg-cream-50/90 backdrop-blur"
          : "border-b border-white/0 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <Image src="/logo-hero.png" alt="طموح" width={36} height={36} className="rounded-lg" />
          <span
            className={`font-display text-lg font-extrabold transition ${
              scrolled ? "text-ink" : "text-white"
            }`}
          >
            طموح
          </span>
        </div>
        <a
          href="#form"
          className="rounded-full bg-flame-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-flame-600"
        >
          سجّل الآن
        </a>
      </div>
    </header>
  );
}
