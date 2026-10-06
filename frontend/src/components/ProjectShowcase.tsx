"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { PROJECTS, type Project } from "@/data/projects";
import { fetchProjects } from "@/lib/api";
import Reveal from "./Reveal";

const ShowcaseScene = dynamic(() => import("./ShowcaseScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-slate-400" role="status">Loading 3D showcase…</div>
  ),
});

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  // The FastAPI backend can override copy/links; static data is the fallback.
  useEffect(() => {
    let cancelled = false;
    void fetchProjects().then((remote) => {
      if (cancelled || !remote || remote.length !== PROJECTS.length) return;
      const known = new Set(PROJECTS.map((p) => p.id));
      if (remote.every((p) => known.has(p.id))) setProjects(remote);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="projects" aria-label="Projects Showcase">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-24">
        <Reveal>
          <h2 className="text-4xl font-bold">Projects <span className="text-gradient">Showcase</span></h2>
          <p className="mt-3 text-slate-400">Academic and personal projects. Scroll inside the 3D scene to move between them.</p>
        </Reveal>
      </div>
      <div className="relative h-screen min-h-[620px] w-full border-y border-white/10">
        <ShowcaseScene projects={projects} />
      </div>
    </section>
  );
}
