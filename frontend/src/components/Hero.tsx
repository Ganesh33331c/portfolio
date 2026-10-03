"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import ProfilePicture from "./ProfilePicture";

const NeuralBackground = dynamic(() => import("./NeuralBackground"), { ssr: false });

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="absolute inset-0 opacity-80">
        <NeuralBackground />
      </div>
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-16 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <p className="mb-4 font-mono text-sm text-neon-cyan">Hi, I&apos;m</p>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Ganesh <span className="text-gradient">Vaddepalli</span>
          </h1>
          <h2 className="mt-5 text-xl font-medium text-slate-200 sm:text-2xl">
            Python Full-Stack &amp; Generative AI Engineer
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
            Architecting scalable Python backends, engineering multi-agent Gen AI systems, and deploying secure web
            applications.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#projects" className="rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-3 font-semibold text-void shadow-cyan transition hover:scale-[1.03]">
              View projects
            </a>
            <a href="#contact" className="glass rounded-xl px-6 py-3 font-semibold transition hover:border-neon-cyan/60">
              Get in touch
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }}>
          <ProfilePicture src="/ganesh-photo.jpg" />
        </motion.div>
      </div>
    </section>
  );
}
