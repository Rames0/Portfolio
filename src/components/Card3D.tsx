"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, MouseEvent, memo, useCallback, useMemo } from "react";

interface Card3DProps {
  children: ReactNode;
  className?: string;
}

const Card3D = memo(function Card3D({ children, className = "" }: Card3DProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const motionStyle = useMemo(() => ({
    rotateX,
    rotateY,
    transformStyle: "preserve-3d" as const
  }), [rotateX, rotateY]);

  const containerStyle = useMemo(() => ({
    transformStyle: "preserve-3d" as const,
    perspective: "1000px"
  }), []);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={containerStyle}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={motionStyle}
        className="relative"
      >
        <div style={{ transform: "translateZ(75px)" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
});

export default Card3D;
