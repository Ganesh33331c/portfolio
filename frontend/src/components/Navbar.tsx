"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CustomLogo from "./CustomLogo";
import { RESUME_PATH } from "@/data/contact";

const ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
] as const;

function ResumeButton({ className = "" }: { className?: string }) {
  return (
    <motion.a
      href={RESUME_PATH}
      download="Ganesh_Vaddepalli_Resume.pdf"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      animate={{ boxShadow: ["0 0 8px rgba(34,211,238,0.35)", "0 0 22px rgba(168,85,247,0.8)", "0 0 8px rgba(34,211,238,0.35)"] }}
      transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
      className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2 text-sm font-bold text-void ${className}`}
    >
      Download Resume
    </motion.a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-void/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5" aria-label="Primary">
        <a href="#home" onClick={(e) => go(e, "#home")} className="flex shrink-0 items-center gap-3 font-semibold">
          <CustomLogo />
          <span className="hidden xl:inline">Ganesh Vaddepalli</span>
        </a>

        <ul
          id="nav-links"
          className={`${open ? "flex" : "hidden"} absolute left-0 top-16 w-full flex-col gap-1 border-b border-white/10 bg-void/95 p-4 lg:static lg:flex lg:w-auto lg:flex-row lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="block rounded-lg px-2.5 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-neon-cyan"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="mt-2 lg:hidden"><ResumeButton className="w-full" /></li>
        </ul>

        <div className="flex items-center gap-3">
          <ResumeButton className="hidden lg:inline-flex" />
          <button
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm lg:hidden"
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </nav>
    </header>
  );
}
