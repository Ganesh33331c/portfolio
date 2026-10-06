"use client";

import { motion } from "framer-motion";
import { RESUME_PATH } from "@/data/contact";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

export default function ResumeBanner() {
  return (
    <section id="resume" className="mx-auto max-w-5xl px-5 pb-8">
      <Reveal>
        <TiltCard max={5}>
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-12">
            <div aria-hidden className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-neon-cyan/20 blur-3xl" />
            <div aria-hidden className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-neon-purple/25 blur-3xl" />
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">Want the full picture?</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-400">Download my resume for projects, skills, certifications and education in one page.</p>
              <motion.a
                href={RESUME_PATH}
                download="Ganesh_Vaddepalli_Resume.pdf"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ["0 0 14px rgba(34,211,238,0.4)", "0 0 38px rgba(168,85,247,0.85)", "0 0 14px rgba(34,211,238,0.4)"] }}
                transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                className="mt-7 inline-block rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple px-8 py-3.5 text-lg font-bold text-void"
              >
                Download Resume
              </motion.a>
            </motion.div>
          </div>
        </TiltCard>
      </Reveal>
    </section>
  );
}
