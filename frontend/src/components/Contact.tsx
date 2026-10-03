"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { sendContact } from "@/lib/api";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-neon-cyan focus:outline-none";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const result = await sendContact({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    });
    setNote(result.detail);
    setStatus(result.ok ? "sent" : "error");
    if (result.ok) form.reset();
  };

  return (
    <section id="contact" className="mx-auto max-w-3xl px-5 py-28">
      <h2 className="mb-8 text-4xl font-bold">Contact</h2>
      <div
        className="[perspective:1200px]"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => { mx.set(0); my.set(0); }}
      >
        <motion.div style={{ rotateX, rotateY }} className="overflow-hidden rounded-xl border border-neon-cyan/30 bg-panel/90 shadow-cyan">
          <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-300" /><span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 font-mono text-xs text-slate-400">ganesh@portfolio: ~/contact</span>
          </div>
          <form onSubmit={onSubmit} className="space-y-4 p-5" noValidate={false}>
            <p className="font-mono text-sm text-neon-cyan">$ ./send_message --to ganesh</p>
            <label className="block">
              <span className="mb-1 block font-mono text-xs text-slate-400">name</span>
              <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" className={field} />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-xs text-slate-400">email</span>
              <input name="email" type="email" required maxLength={120} autoComplete="email" placeholder="you@company.com" className={field} />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-xs text-slate-400">message</span>
              <textarea name="message" required minLength={10} maxLength={2000} rows={5} placeholder="What would you like to build or discuss?" className={field} />
            </label>
            {/* honeypot: hidden from people, bots fill it */}
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-md bg-gradient-to-r from-neon-cyan to-neon-purple px-5 py-2 font-semibold text-void transition hover:scale-[1.03] disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              <p role="status" aria-live="polite" className={`font-mono text-sm ${status === "error" ? "text-red-400" : "text-green-400"}`}>
                {status === "sending" ? "The free server may need up to a minute to wake up." : status === "sent" || status === "error" ? note : ""}
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
