"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { sendContact } from "@/lib/api";
import { CONTACT } from "@/data/contact";
import Reveal from "./Reveal";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-neon-cyan focus:outline-none";

const icon = "h-5 w-5 shrink-0 text-neon-cyan";

function Row({ children, label, href }: { children: React.ReactNode; label: string; href?: string }) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">{children}</span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-wider text-slate-500">{label}</span>
      </span>
    </>
  );
  return href ? <a href={href} className="group flex items-center gap-4">{inner}</a> : <div className="flex items-center gap-4">{inner}</div>;
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -4, rotateY: 18, scale: 1.1 }}
      className="glass flex h-12 w-12 items-center justify-center rounded-xl text-slate-200 transition-colors hover:text-neon-cyan hover:shadow-cyan"
      style={{ transformPerspective: 400 }}
    >
      {children}
    </motion.a>
  );
}

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
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    });
    setNote(result.detail);
    setStatus(result.ok ? "sent" : "error");
    if (result.ok) form.reset();
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-28">
      <Reveal><h2 className="mb-10 text-4xl font-bold">Get in <span className="text-gradient">touch</span></h2></Reveal>
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="space-y-6">
            <p className="max-w-md text-slate-400">Open to full-stack, Gen AI and security roles in the Greater Hyderabad area and remote. Send a message or reach out directly.</p>
            <Row label="Phone" href={CONTACT.phoneHref}>
              <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" /></svg>
            </Row>
            <p className="-mt-4 pl-[3.75rem] text-slate-200">{CONTACT.phone}</p>
            <Row label="Email" href={`mailto:${CONTACT.email}`}>
              <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
            </Row>
            <p className="-mt-4 break-all pl-[3.75rem] text-slate-200">{CONTACT.email}</p>
            <Row label="Location">
              <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
            </Row>
            <div className="-mt-4 pl-[3.75rem]">
              <p className="text-slate-200">{CONTACT.location}</p>
              {CONTACT.address && <p className="text-sm text-slate-500">{CONTACT.address}</p>}
            </div>
            <div className="flex gap-4 pt-2">
              <Social href={CONTACT.linkedin} label="LinkedIn profile">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </Social>
              <Social href={CONTACT.github} label="GitHub profile">
                <svg viewBox="0 0 16 16" className="h-6 w-6" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
              </Social>
            </div>
          </div>
        </Reveal>

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
            <form onSubmit={onSubmit} className="relative space-y-4 p-5">
              <p className="font-mono text-sm text-neon-cyan">$ ./send_message --to ganesh</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block font-mono text-xs text-slate-400">name</span>
                  <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" className={field} />
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono text-xs text-slate-400">email</span>
                  <input name="email" type="email" required maxLength={120} autoComplete="email" placeholder="you@company.com" className={field} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block font-mono text-xs text-slate-400">subject</span>
                <input name="subject" required minLength={3} maxLength={120} placeholder="Role, project or question" className={field} />
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
                <p role="status" aria-live="polite" className={`font-mono text-sm ${status === "error" ? "text-red-400" : status === "sending" ? "text-slate-400" : "text-green-400"}`}>
                  {status === "sending" ? "The free server may need up to a minute to wake up." : status === "sent" || status === "error" ? note : ""}
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
