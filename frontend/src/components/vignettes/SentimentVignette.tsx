"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { VignetteProps } from "./types";

const PARTICLES = 90;
const ZONES = [
  { name: "positive", color: "#4ade80", center: new THREE.Vector3(2.8, 1.5, 0) },
  { name: "neutral", color: "#94a3b8", center: new THREE.Vector3(3.2, -0.3, 0.4) },
  { name: "negative", color: "#f87171", center: new THREE.Vector3(2.6, -2.1, -0.2) },
] as const;
const SOURCE = new THREE.Vector3(-3.6, 0, 0);

function Face({ mood, color, position }: { mood: 0 | 1 | 2; color: string; position: THREE.Vector3 }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.position.y = position.y + Math.sin(s.clock.elapsedTime * 1.5 + mood) * 0.12;
  });
  return (
    <group ref={ref} position={[position.x + 1.4, position.y, position.z]}>
      <mesh><sphereGeometry args={[0.3, 20, 20]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></mesh>
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.26]}><sphereGeometry args={[0.04, 8, 8]} /><meshBasicMaterial color="#05060f" /></mesh>
      ))}
      {mood === 1 ? (
        <mesh position={[0, -0.1, 0.28]}><boxGeometry args={[0.2, 0.03, 0.02]} /><meshBasicMaterial color="#05060f" /></mesh>
      ) : (
        <mesh position={[0, mood === 0 ? -0.05 : -0.16, 0.27]} rotation={[0, 0, mood === 0 ? Math.PI : 0]}>
          <torusGeometry args={[0.1, 0.018, 8, 16, Math.PI]} />
          <meshBasicMaterial color="#05060f" />
        </mesh>
      )}
    </group>
  );
}

export default function SentimentVignette({ active }: VignetteProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, (_, i) => {
        const zone = i % 3;
        const c = ZONES[zone]!.center;
        const jitter = new THREE.Vector3(Math.sin(i * 12.9898) * 0.55, Math.cos(i * 78.233) * 0.45, Math.sin(i * 3.1) * 0.4);
        return { zone, target: c.clone().add(jitter), offset: (i / PARTICLES) * 6, bend: Math.sin(i * 5.7) * 0.9 };
      }),
    [],
  );

  const edges = useMemo(
    () => ZONES.map((z) => [SOURCE.toArray(), z.center.toArray()] as [THREE.Vector3Tuple, THREE.Vector3Tuple]),
    [],
  );

  useFrame((s) => {
    const m = mesh.current;
    if (!m) return;
    const t = s.clock.elapsedTime * (active ? 1 : 0.25);
    particles.forEach((p, i) => {
      const k = ((t * 0.35 + p.offset) % 1 + 1) % 1;
      const eased = k * k * (3 - 2 * k);
      dummy.position.lerpVectors(SOURCE, p.target, eased);
      dummy.position.y += Math.sin(k * Math.PI) * p.bend;
      dummy.scale.setScalar(0.07 + eased * 0.05);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, colorObj.set(k < 0.55 ? "#e2e8f0" : ZONES[p.zone]!.color));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group position={[-0.4, 0, 0]}>
      <mesh position={SOURCE}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#22d3ee" wireframe emissive="#22d3ee" emissiveIntensity={1.2} />
      </mesh>
      {edges.map((pts, i) => (
        <Line key={i} points={pts} color={ZONES[i]!.color} lineWidth={1} transparent opacity={0.35} />
      ))}
      {ZONES.map((z, i) => (
        <group key={z.name}>
          <mesh position={z.center}>
            <sphereGeometry args={[0.95, 24, 24]} />
            <meshBasicMaterial color={z.color} transparent opacity={0.1} depthWrite={false} />
          </mesh>
          <Face mood={i as 0 | 1 | 2} color={z.color} position={z.center} />
        </group>
      ))}
      <instancedMesh ref={mesh} args={[undefined, undefined, PARTICLES]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
}
