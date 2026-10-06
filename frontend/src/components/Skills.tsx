"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SKILLS } from "@/data/projects";
import Reveal from "./Reveal";

function TiltBadge({ label, index }: { label: string; index: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 220, damping: 16 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [22, -22]), { stiffness: 220, damping: 16 });
  const accent = index % 2 === 0 ? "hover:shadow-cyan hover:border-neon-cyan/60" : "hover:shadow-purple hover:border-neon-purple/60";

  return (
    <div
      className="[perspective:700px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, index % 2 ? -6 : 6, 0] }}
        transition={{ duration: 4 + (index % 4), repeat: Infinity, ease: "easeInOut" }}
        className={`glass flex h-24 items-center justify-center rounded-2xl px-3 text-center font-semibold transition-shadow ${accent}`}
      >
        <span style={{ transform: "translateZ(24px)" }}>{label}</span>
      </motion.div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal><h2 className="text-4xl font-bold">Skills <span className="text-gradient">(Tech Stack)</span></h2></Reveal>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {SKILLS.map((s, i) => (
          <li key={s}><TiltBadge label={s} index={i} /></li>
        ))}
      </ul>
    </section>
  );
}
