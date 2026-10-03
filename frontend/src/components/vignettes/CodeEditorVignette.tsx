"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { VignetteProps } from "./types";

interface Line { text: string; color: string; indent: number }

const LINES: Line[] = [
  { text: "import { WebSocketServer } from 'ws';", color: "#c084fc", indent: 0 },
  { text: "const wss = new WebSocketServer({ port: 8080 });", color: "#22d3ee", indent: 0 },
  { text: "wss.on('connection', (peer) => {", color: "#f1f5f9", indent: 0 },
  { text: "peer.on('message', (delta) => {", color: "#facc15", indent: 1 },
  { text: "broadcast(applyOT(delta));", color: "#4ade80", indent: 2 },
  { text: "});", color: "#f1f5f9", indent: 1 },
  { text: "peer.send(snapshot());", color: "#f472b6", indent: 1 },
  { text: "});", color: "#f1f5f9", indent: 0 },
];
const TOTAL = LINES.reduce((n, l) => n + l.text.length, 0);
const CURSORS = ["#22d3ee", "#f472b6", "#4ade80"];

export default function CodeEditorVignette({ active }: VignetteProps) {
  const [typed, setTyped] = useState(0);
  const cursorRefs = useRef<(THREE.Mesh | null)[]>([]);
  const panel = useRef<THREE.Group>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(7, 4, 0.12)), []);

  useEffect(() => {
    if (!active) { setTyped(0); return; }
    const id = window.setInterval(() => setTyped((t) => (t >= TOTAL + 40 ? 0 : t + 1)), 55);
    return () => window.clearInterval(id);
  }, [active]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (panel.current) {
      panel.current.position.y = Math.sin(t * 0.9) * 0.12;
      panel.current.rotation.y = Math.sin(t * 0.4) * 0.12;
    }
    cursorRefs.current.forEach((m, i) => {
      if (!m) return;
      m.position.set(-2.6 + ((Math.sin(t * (0.5 + i * 0.23) + i * 2) + 1) / 2) * 4.2, 1.2 - ((Math.cos(t * (0.4 + i * 0.17) + i) + 1) / 2) * 2.6, 0.15);
    });
  });

  let remaining = typed;
  return (
    <group ref={panel}>
      <mesh>
        <boxGeometry args={[7, 4, 0.12]} />
        <meshPhysicalMaterial color="#04140f" transparent opacity={0.55} roughness={0.2} transmission={0.2} />
      </mesh>
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color="#22d3ee" />
      </lineSegments>
      {[-0.75, -0.55, -0.35].map((x, i) => (
        <mesh key={x} position={[3.2 + x * 0.4, 1.8, 0.08]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color={["#f87171", "#facc15", "#4ade80"][i]} />
        </mesh>
      ))}
      {LINES.map((line, i) => {
        const shown = Math.max(0, Math.min(line.text.length, remaining));
        remaining -= line.text.length;
        return (
          <Text
            key={i}
            position={[-3.2 + line.indent * 0.35, 1.3 - i * 0.42, 0.1]}
            fontSize={0.2}
            anchorX="left"
            anchorY="middle"
            color={line.color}
          >
            {line.text.slice(0, shown) || " "}
          </Text>
        );
      })}
      {CURSORS.map((c, i) => (
        <mesh key={c} ref={(m) => { cursorRefs.current[i] = m; }}>
          <coneGeometry args={[0.1, 0.28, 3]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.6} />
        </mesh>
      ))}
    </group>
  );
}
