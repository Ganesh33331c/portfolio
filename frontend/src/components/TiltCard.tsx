"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
}

export default function TiltCard({ children, className = "", max = 10 }: Props) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), { stiffness: 160, damping: 16 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), { stiffness: 160, damping: 16 });

  return (
    <div
      className="h-full [perspective:900px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={`h-full ${className}`}>
        {children}
      </motion.div>
    </div>
  );
}
