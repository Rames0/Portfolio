"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function NodeNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const particleCount = 100;
  const maxDistance = 2.5;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, []);

  const linesPositions = useMemo(() => new Float32Array(particleCount * particleCount * 3), []);
  const linesOpacities = useMemo(() => new Float32Array(particleCount * particleCount), []);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    let lineIdx = 0;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      if (pos[i * 3] > 7.5 || pos[i * 3] < -7.5) velocities[i * 3] *= -1;
      if (pos[i * 3 + 1] > 7.5 || pos[i * 3 + 1] < -7.5) velocities[i * 3 + 1] *= -1;
      if (pos[i * 3 + 2] > 5 || pos[i * 3 + 2] < -5) velocities[i * 3 + 2] *= -1;

      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          linesPositions[lineIdx * 6] = pos[i * 3];
          linesPositions[lineIdx * 6 + 1] = pos[i * 3 + 1];
          linesPositions[lineIdx * 6 + 2] = pos[i * 3 + 2];
          linesPositions[lineIdx * 6 + 3] = pos[j * 3];
          linesPositions[lineIdx * 6 + 4] = pos[j * 3 + 1];
          linesPositions[lineIdx * 6 + 5] = pos[j * 3 + 2];
          const opacity = 1 - dist / maxDistance;
          linesOpacities[lineIdx * 2] = opacity;
          linesOpacities[lineIdx * 2 + 1] = opacity;
          lineIdx++;
        }
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
    // Custom shader needed for line opacity per vertex
  });

  return (
    <group rotation={[Math.PI / 8, Math.PI / 4, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#e3c849" size={0.05} transparent opacity={0.6} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linesPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#e3c849" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

export function HeroGrid() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden="true" style={{ opacity: 0.8 }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ alpha: true, antialias: false }}>
        <fog attach="fog" args={["#161714", 5, 25]} />
        <NodeNetwork />
      </Canvas>
    </div>
  );
}
