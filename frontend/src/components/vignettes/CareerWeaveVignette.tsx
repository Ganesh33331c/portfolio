"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { VignetteProps } from "./types";

const WARP = 15;
const W = 5.2;
const H = 3.6;

interface WeaveNode { x: number; y: number; kind: "resume" | "skill"; color: string }

const NODES: WeaveNode[] = [
  { x: -1.8, y: 1.2, kind: "resume", color: "#22d3ee" },
  { x: 0.2, y: 0.9, kind: "skill", color: "#a855f7" },
  { x: 1.9, y: 1.1, kind: "resume", color: "#f472b6" },
  { x: -1.1, y: -0.1, kind: "skill", color: "#facc15" },
  { x: 1.0, y: -0.3, kind: "skill", color: "#4ade80" },
  { x: -0.2, y: -1.3, kind: "resume", color: "#22d3ee" },
  { x: 1.8, y: -1.4, kind: "skill", color: "#a855f7" },
];

export default function CareerWeaveVignette({ active }: VignetteProps) {
  const shuttle = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const thread = useRef<THREE.Mesh>(null);

  const warp = useMemo(
    () => Array.from({ length: WARP }, (_, i) => {
      const x = -W / 2 + (i / (WARP - 1)) * W;
      return [[x, -H / 2, 0], [x, H / 2, 0]] as [THREE.Vector3Tuple, THREE.Vector3Tuple];
    }),
    [],
  );

  useFrame((s) => {
    const t = s.clock.elapsedTime * (active ? 1 : 0.3);
    const phase = (t * 0.18) % 1;
    const wy = THREE.MathUtils.lerp(H / 2, -H / 2, phase);
    const wx = Math.sin(t * 3) * (W / 2);
    shuttle.current?.position.set(wx, wy, 0.15);
    if (thread.current) {
      thread.current.position.y = (H / 2 + wy) / 2;
      thread.current.scale.y = Math.max(0.001, H / 2 - wy);
    }
    NODES.forEach((n, i) => {
      const g = nodeRefs.current[i];
      if (!g) return;
      const woven = n.y > wy;
      const target = woven ? 1 : 0.35;
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 6, 1 / 60));
      g.position.z = THREE.MathUtils.damp(g.position.z, woven ? 0.2 : -0.1, 6, 1 / 60);
      g.rotation.y = Math.sin(t + i) * 0.25;
    });
  });

  return (
    <group>
      {/* loom frame */}
      {[[-W / 2 - 0.2, 0, 0.12, H + 0.5], [W / 2 + 0.2, 0, 0.12, H + 0.5]].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x!, y!, 0]}><boxGeometry args={[w!, h!, 0.2]} /><meshStandardMaterial color="#312e81" emissive="#4f46e5" emissiveIntensity={0.5} metalness={0.6} roughness={0.4} /></mesh>
      ))}
      {[H / 2 + 0.2, -H / 2 - 0.2].map((y) => (
        <mesh key={y} position={[0, y, 0]}><boxGeometry args={[W + 0.5, 0.12, 0.2]} /><meshStandardMaterial color="#312e81" emissive="#4f46e5" emissiveIntensity={0.5} metalness={0.6} roughness={0.4} /></mesh>
      ))}
      {warp.map((pts, i) => (
        <Line key={i} points={pts} color="#818cf8" lineWidth={1} transparent opacity={0.45} />
      ))}
      {/* woven light thread */}
      <mesh ref={thread} position={[0, 0, 0.02]}>
        <planeGeometry args={[W, 1]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh ref={shuttle}>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#fff" emissive="#22d3ee" emissiveIntensity={2.2} />
      </mesh>
      {NODES.map((n, i) => (
        <group key={i} ref={(g) => { nodeRefs.current[i] = g; }} position={[n.x, n.y, -0.1]} scale={0.35}>
          {n.kind === "resume" ? (
            <>
              <mesh><planeGeometry args={[0.6, 0.8]} /><meshStandardMaterial color="#f8fafc" emissive={n.color} emissiveIntensity={0.35} side={THREE.DoubleSide} /></mesh>
              {[0.2, 0.05, -0.1, -0.25].map((y) => (
                <mesh key={y} position={[0, y, 0.01]}><planeGeometry args={[0.4, 0.04]} /><meshBasicMaterial color={n.color} /></mesh>
              ))}
            </>
          ) : (
            <mesh><dodecahedronGeometry args={[0.32, 0]} /><meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.9} flatShading /></mesh>
          )}
        </group>
      ))}
    </group>
  );
}
