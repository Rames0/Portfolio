"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function DataGrid() {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  const [positions, opacityMap] = useMemo(() => {
    const p = [];
    const size = 30;
    const divisions = 30;
    const step = size / divisions;
    const halfSize = size / 2;
    
    // Create grid logic
    for (let i = 0; i <= divisions; i++) {
        p.push(-halfSize, 0, i * step - halfSize);
        p.push(halfSize, 0, i * step - halfSize);
        p.push(i * step - halfSize, 0, -halfSize);
        p.push(i * step - halfSize, 0, halfSize);
    }
    const posArray = new Float32Array(p);
    return [posArray, null];
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
        // Slow continuous slight rotation
        lineRef.current.position.y = -2;
        lineRef.current.position.z = -5;
        lineRef.current.rotation.x = 0.5 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        lineRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach={"attributes-position"}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#e3c849" transparent opacity={0.15} fog={true} />
    </lineSegments>
  );
}

export function HeroGrid() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden="true" style={{ opacity: 0.6 }}>
      <Canvas camera={{ position: [0, 5, 5], fov: 60 }} gl={{ alpha: true, antialias: false }}>
        <fog attach="fog" args={["#f4f3ee", 5, 15]} />
        <DataGrid />
      </Canvas>
    </div>
  );
}
