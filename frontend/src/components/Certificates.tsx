import { CERTIFICATES } from "@/data/certificates";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

function Seal({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
      <circle cx="32" cy="28" r="18" fill="none" stroke={color} strokeWidth="2.5" />
      <path d="m24 28 6 6 11-12" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 44 18 60l14-6 14 6-4-16" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function Certificates() {
  return (
    <section id="certificates" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal><h2 className="text-4xl font-bold">Certi<span className="text-gradient">fications</span></h2></Reveal>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {CERTIFICATES.map((c, i) => {
          const color = c.accent === "cyan" ? "#22d3ee" : "#a855f7";
          return (
            <li key={c.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <TiltCard max={9}>
                  <article
                    className="glass flex h-full flex-col justify-between rounded-2xl p-6"
                    style={{ boxShadow: `0 0 0 1px ${color}33, 0 18px 40px -18px ${color}88` }}
                  >
                    <div className="flex items-start gap-4">
                      <Seal color={color} />
                      <div>
                        <h3 className="text-xl font-bold leading-snug">{c.title}</h3>
                        <p className="mt-1 text-slate-300">{c.issuer}</p>
                        <p className="font-mono text-xs text-slate-500">{c.date}</p>
                      </div>
                    </div>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-white/5"
                      style={{ borderColor: `${color}88`, color }}
                    >
                      Verify credential <span aria-hidden>↗</span>
                    </a>
                  </article>
                </TiltCard>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
