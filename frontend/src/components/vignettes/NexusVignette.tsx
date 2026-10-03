"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { VignetteProps } from "./types";

const BARRIERS = [0.2, 1.5, 2.8];

export default function NexusVignette({ active }: VignetteProps) {
  const shield = useRef<THREE.Mesh>(null);
  const key = useRef<THREE.Group>(null);
  const leds = useRef<(THREE.Mesh | null)[]>([]);
  const barriers = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (shield.current) {
      const pulse = 1 + Math.sin(t * 2.2) * 0.05;
      shield.current.scale.setScalar(pulse);
      (shield.current.material as THREE.MeshBasicMaterial).opacity = 0.14 + (Math.sin(t * 2.2) + 1) * 0.06;
      shield.current.rotation.y = t * 0.2;
    }
    leds.current.forEach((m, i) => {
      if (m) (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + (Math.sin(t * 4 + i * 1.3) + 1) * 0.9;
    });
    // key travels left→right through barriers, each dissolving as it passes
    const cycle = (t * (active ? 0.18 : 0.06)) % 1;
    const kx = THREE.MathUtils.lerp(-3.4, 3.4, cycle);
    if (key.current) { key.current.position.x = kx; key.current.rotation.x = t * 2; }
    barriers.current.forEach((b, i) => {
      if (!b) return;
      const bx = BARRIERS[i]!;
      const open = kx > bx - 0.3 ? Math.min(1, (kx - (bx - 0.3)) / 0.8) : 0;
      (b.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(0.45, 0.04, open);
    });
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* server rack */}
      <group position={[-1.6, 0, 0]}>
        <mesh><boxGeometry args={[1.8, 3.6, 1.2]} /><meshStandardMaterial color="#0f1224" metalness={0.8} roughness={0.35} /></mesh>
        {Array.from({ length: 7 }, (_, i) => (
          <group key={i} position={[0, 1.4 - i * 0.46, 0.61]}>
            <mesh><boxGeometry args={[1.6, 0.34, 0.04]} /><meshStandardMaterial color="#1b2040" metalness={0.6} roughness={0.4} /></mesh>
            <mesh ref={(m) => { leds.current[i] = m; }} position={[0.6, 0, 0.04]}>
              <boxGeometry args={[0.12, 0.08, 0.03]} />
              <meshStandardMaterial color={i % 2 ? "#a855f7" : "#22d3ee"} emissive={i % 2 ? "#a855f7" : "#22d3ee"} emissiveIntensity={1} />
            </mesh>
          </group>
        ))}
      </group>
      {/* pulsing shield */}
      <mesh ref={shield} position={[-1.6, 0, 0]}>
        <icosahedronGeometry args={[2.7, 2]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.18} />
      </mesh>
      {/* firewall barriers */}
      {BARRIERS.map((x, i) => (
        <mesh key={x} ref={(m) => { barriers.current[i] = m; }} position={[x, 0, 0]}>
          <planeGeometry args={[0.08, 3.4]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* key */}
      <group ref={key} position={[-3.4, 0, 0.9]}>
        <mesh><torusGeometry args={[0.2, 0.05, 12, 24]} /><meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.9} metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.7, 10]} /><meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.9} /></mesh>
        {[0.7, 0.55].map((x) => (
          <mesh key={x} position={[x, -0.1, 0]}><boxGeometry args={[0.07, 0.16, 0.07]} /><meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.9} /></mesh>
        ))}
      </group>
    </group>
  );
}
