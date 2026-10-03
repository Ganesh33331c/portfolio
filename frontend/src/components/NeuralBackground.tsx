"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 70;
const LINK_DIST = 2.1;

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Web() {
  const group = useRef<THREE.Group>(null);

  const { points, lines } = useMemo(() => {
    const rnd = seeded(42);
    const pos = new Float32Array(NODE_COUNT * 3);
    const vecs: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const v = new THREE.Vector3((rnd() - 0.5) * 11, (rnd() - 0.5) * 7, (rnd() - 0.5) * 5);
      vecs.push(v);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const seg: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (vecs[i]!.distanceTo(vecs[j]!) < LINK_DIST) {
          seg.push(vecs[i]!.x, vecs[i]!.y, vecs[i]!.z, vecs[j]!.x, vecs[j]!.y, vecs[j]!.z);
        }
      }
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(seg), 3));
    return { points: pg, lines: lg };
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * 0.07;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * 0.25, 3, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, state.pointer.x * 0.5, 3, dt);
  });

  return (
    <group ref={group}>
      <points geometry={points}>
        <pointsMaterial color="#22d3ee" size={0.09} sizeAttenuation transparent opacity={0.95} />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

export default function NeuralBackground() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ antialias: false, powerPreference: "low-power" }}
      aria-hidden
    >
      <Web />
    </Canvas>
  );
}
