"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Scroll, ScrollControls, useScroll } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "@/data/projects";
import { SHOWCASE_GOTO_EVENT } from "@/lib/events";
import type { VignetteProps } from "./vignettes/types";
import CodeEditorVignette from "./vignettes/CodeEditorVignette";
import SentimentVignette from "./vignettes/SentimentVignette";
import NexusVignette from "./vignettes/NexusVignette";
import ExploitVignette from "./vignettes/ExploitVignette";
import CareerWeaveVignette from "./vignettes/CareerWeaveVignette";
import GithubLogo3D from "./vignettes/GithubLogo3D";

const SPACING = 18;

const VIGNETTES: Record<Project["id"], React.ComponentType<VignetteProps>> = {
  "code-editor": CodeEditorVignette,
  sentiment: SentimentVignette,
  nexus: NexusVignette,
  "exploit-explainer": ExploitVignette,
  careerweave: CareerWeaveVignette,
};

function Rig({ projects }: { projects: Project[] }) {
  const scroll = useScroll();
  const { camera, size } = useThree();
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const wide = size.width >= 900;
  const last = projects.length - 1;

  // Jump to a vignette when the navbar asks for it.
  useEffect(() => {
    const onGoto = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail;
      const el = scroll.el;
      const max = el.scrollHeight - el.clientHeight;
      el.scrollTo({ top: (Math.min(Math.max(idx, 0), last) / last) * max, behavior: "smooth" });
    };
    window.addEventListener(SHOWCASE_GOTO_EVENT, onGoto);
    return () => window.removeEventListener(SHOWCASE_GOTO_EVENT, onGoto);
  }, [scroll, last]);

  useFrame((_, dt) => {
    const targetX = scroll.offset * last * SPACING - (wide ? 2.4 : 0);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 4, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, wide ? 0 : -1.6, 4, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, wide ? 10 : 14, 4, dt);
    const idx = Math.min(last, Math.max(0, Math.round(scroll.offset * last)));
    if (idx !== currentRef.current) { currentRef.current = idx; setCurrent(idx); }
  });

  return (
    <>
      {projects.map((p, i) => {
        const Vignette = VIGNETTES[p.id];
        return (
          <group key={p.id} position={[i * SPACING, 0, 0]}>
            <Vignette active={current === i} />
            {p.github && <GithubLogo3D url={p.github} position={[3.9, 2.5, 0.8]} />}
          </group>
        );
      })}
    </>
  );
}

function Overlay({ projects }: { projects: Project[] }) {
  return (
    <div className="pointer-events-none w-screen">
      {projects.map((p, i) => (
        <div key={p.id} className="absolute left-0 flex h-screen w-full items-end px-5 pb-10 pt-24 md:items-center md:pb-0" style={{ top: `${i * 100}vh` }}>
          <article className="glass pointer-events-auto max-w-md rounded-2xl p-6 shadow-purple md:ml-[max(0px,calc((100vw-80rem)/2))]">
            <p className="text-sm text-neon-cyan">
              {p.category === "academic" ? "Academic project" : "Personal project"} · {i + 1} of {projects.length}
            </p>
            <h3 className="mt-2 text-2xl font-bold leading-tight">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{p.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs">{s}</li>
              ))}
            </ul>
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-semibold text-neon-purple hover:text-neon-cyan">
                View source on GitHub
              </a>
            )}
          </article>
        </div>
      ))}
    </div>
  );
}

export default function ShowcaseScene({ projects }: { projects: Project[] }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [-2.4, 0, 10], fov: 45 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <color attach="background" args={["#05060f"]} />
      <fog attach="fog" args={["#05060f", 14, 34]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[6, 6, 8]} intensity={90} color="#22d3ee" />
      <pointLight position={[-6, -4, 8]} intensity={70} color="#a855f7" />
      <ScrollControls pages={projects.length} damping={0.25}>
        <Rig projects={projects} />
        <Scroll html style={{ width: "100%" }}>
          <Overlay projects={projects} />
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
}
