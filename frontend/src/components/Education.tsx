import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-4xl px-5 py-24">
      <Reveal><h2 className="text-4xl font-bold">Edu<span className="text-gradient">cation</span></h2></Reveal>
      <div className="relative mt-10 pl-8 sm:pl-12">
        <span aria-hidden className="absolute bottom-0 left-2 top-2 w-px bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent sm:left-4" />
        <span aria-hidden className="absolute left-0 top-2 h-4 w-4 rounded-full bg-neon-cyan shadow-cyan sm:left-2" />
        <Reveal>
          <TiltCard max={6}>
            <article className="glass rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-sm text-neon-cyan">2022 – 2026</p>
              <h3 className="mt-2 text-2xl font-bold">Bachelor of Technology (B.Tech) in Computer Science and Engineering</h3>
              <p className="mt-3 text-slate-300">Department of Computer Science and Engineering</p>
              <p className="text-slate-400">University College of Engineering, Kakatiya University, Kothagudem</p>
              <p className="mt-4 inline-block rounded-full border border-neon-purple/50 bg-neon-purple/10 px-3 py-1 text-sm text-neon-purple">CGPA 7.3 / 10.0</p>
            </article>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
