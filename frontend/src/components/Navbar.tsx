"use client";

import { useState } from "react";
import CustomLogo from "./CustomLogo";
import { SHOWCASE_GOTO_EVENT } from "@/lib/events";

interface NavItem {
  label: string;
  href: string;
  /** index of the project vignette to jump to, if any */
  showcaseIndex?: number;
}

const ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Academic Projects", href: "#projects", showcaseIndex: 0 },
  { label: "Personal Projects", href: "#projects", showcaseIndex: 2 },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
    if (item.showcaseIndex !== undefined) {
      const index = item.showcaseIndex;
      window.setTimeout(
        () => window.dispatchEvent(new CustomEvent<number>(SHOWCASE_GOTO_EVENT, { detail: index })),
        650,
      );
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-void/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5" aria-label="Primary">
        <a href="#home" onClick={(e) => go(e, ITEMS[0]!)} className="flex items-center gap-3 font-semibold">
          <CustomLogo />
          <span className="hidden sm:inline">Ganesh Vaddepalli</span>
        </a>

        <button
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <ul
          id="nav-links"
          className={`${open ? "flex" : "hidden"} absolute left-0 top-16 w-full flex-col gap-1 border-b border-white/10 bg-void/95 p-4 md:static md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0`}
        >
          {ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => go(e, item)}
                className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-neon-cyan"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
