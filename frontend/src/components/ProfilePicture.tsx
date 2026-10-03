"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  src: string;
  alt?: string;
}

export default function ProfilePicture({ src, alt = "Portrait of Ganesh Vaddepalli" }: Props) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 140, damping: 16 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 140, damping: 16 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <div className="[perspective:1100px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto w-[min(78vw,340px)]"
      >
        <div
          aria-hidden
          className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-neon-cyan/50 via-transparent to-neon-purple/60 blur-2xl"
        />
        <div className="glass relative rounded-[1.75rem] p-3 shadow-purple" style={{ transform: "translateZ(30px)" }}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-slate-900">
            <Image src={src} alt={alt} fill priority sizes="340px" className="object-cover object-top" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent" />
          </div>
          <div
            className="glass absolute -bottom-5 left-6 right-6 rounded-xl px-4 py-2 text-center text-sm"
            style={{ transform: "translateZ(60px)" }}
          >
            <span className="text-gradient font-semibold">Ganesh Vaddepalli</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
