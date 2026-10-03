"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const OCTICON =
  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z";

function buildGeometry(): THREE.ExtrudeGeometry {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="${OCTICON}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: 1.4, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.12, bevelSegments: 2 });
  geo.center();
  return geo;
}

interface Props {
  url: string;
  position?: [number, number, number];
  scale?: number;
}

/** Clickable extruded GitHub mark. Opens `url` in a new tab. */
export default function GithubLogo3D({ url, position = [0, 0, 0], scale = 0.16 }: Props) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const geometry = useMemo(buildGeometry, []);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const target = hover ? scale * 1.25 : scale;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 8, dt));
    g.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.4;
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.4) * 0.08;
  });

  return (
    <group
      ref={ref}
      position={position}
      scale={[scale, -scale, scale]}
      onClick={(e) => { e.stopPropagation(); window.open(url, "_blank", "noopener,noreferrer"); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial color={hover ? "#22d3ee" : "#f1f5f9"} emissive={hover ? "#22d3ee" : "#a855f7"} emissiveIntensity={hover ? 0.9 : 0.35} metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}
