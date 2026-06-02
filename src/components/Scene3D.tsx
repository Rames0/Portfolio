"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars as DreiStars } from "@react-three/drei";
import { useRef, useEffect, useMemo, memo, useCallback, useState } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";

// ─── Texture Cache ───────────────────────────────────────────────────────────
const textureCache = new Map<string, THREE.CanvasTexture>();

// ─── PBR Texture Generator ───────────────────────────────────────────────────
function createPBRTexture(
    type: "albedo" | "normal" | "roughness" | "displacement",
    planetType: string,
    colors: string[],
    seed: number
): THREE.CanvasTexture {
  const key = `${planetType}-${type}-${colors.join("-")}-${seed}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Simple seeded random
  let rng = seed;
  const rand = () => {
    rng = (rng * 16807 + 0) % 2147483647;
    return (rng - 1) / 2147483646;
  };

  if (type === "albedo") {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, 1024, 512);

    if (planetType === "earth") {
      // Continents
      for (let i = 0; i < 8; i++) {
        const x = rand() * 1024;
        const y = rand() * 512;
        const w = rand() * 300 + 100;
        const h = rand() * 150 + 50;
        ctx.fillStyle = colors[1] || colors[0];
        ctx.globalAlpha = 0.7 + rand() * 0.3;
        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, h / 2, rand() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      // Clouds
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.ellipse(rand() * 1024, rand() * 512, rand() * 80 + 20, rand() * 30 + 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (planetType === "gas") {
      // Banded patterns
      for (let y = 0; y < 512; y += 4) {
        const band = Math.floor(y / 32) % colors.length;
        ctx.fillStyle = colors[band] || colors[0];
        ctx.globalAlpha = 0.8 + Math.sin(y * 0.1) * 0.2;
        ctx.fillRect(0, y, 1024, 4);
      }
      // Storms
      for (let i = 0; i < 5; i++) {
        const x = rand() * 1024;
        const y = rand() * 512;
        const r = rand() * 60 + 20;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, "rgba(0,0,0,0.5)");
        grd.addColorStop(0.7, "rgba(0,0,0,0.2)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (planetType === "rocky") {
      // Noise-like surface
      for (let i = 0; i < 300; i++) {
        const x = rand() * 1024;
        const y = rand() * 512;
        const r = rand() * 40 + 5;
        ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
        ctx.globalAlpha = 0.3 + rand() * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Craters
      for (let i = 0; i < 30; i++) {
        const x = rand() * 1024;
        const y = rand() * 512;
        const r = rand() * 25 + 5;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.beginPath();
        ctx.arc(x + r * 0.2, y + r * 0.2, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (type === "normal") {
    // Flat normal map (neutral blue)
    ctx.fillStyle = "#8080ff";
    ctx.fillRect(0, 0, 1024, 512);
    // Subtle variation
    for (let i = 0; i < 200; i++) {
      const x = rand() * 1024;
      const y = rand() * 512;
      const r = rand() * 20 + 2;
      const nx = Math.floor((rand() - 0.5) * 30 + 128);
      const ny = Math.floor((rand() - 0.5) * 30 + 128);
      ctx.fillStyle = `rgb(${nx},${ny},255)`;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "roughness") {
    ctx.fillStyle = planetType === "gas" ? "#808080" : "#c0c0c0";
    ctx.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 100; i++) {
      const x = rand() * 1024;
      const y = rand() * 512;
      const r = rand() * 30 + 5;
      const v = Math.floor(rand() * 255);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "displacement") {
    ctx.fillStyle = "#404040";
    ctx.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 50; i++) {
      const x = rand() * 1024;
      const y = rand() * 512;
      const r = rand() * 20 + 5;
      const v = Math.floor(rand() * 100 + 50);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  textureCache.set(key, tex);
  return tex;
}

// ─── Cloud Texture Generator ─────────────────────────────────────────────────
function createCloudTexture(seed: number): THREE.CanvasTexture {
  const key = `clouds-${seed}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 1024, 512);
  let rng = seed;
  const rand = () => {
    rng = (rng * 16807 + 0) % 2147483647;
    return (rng - 1) / 2147483646;
  };

  for (let i = 0; i < 80; i++) {
    const x = rand() * 1024;
    const y = rand() * 512;
    const w = rand() * 200 + 50;
    const h = rand() * 60 + 20;
    ctx.fillStyle = `rgba(255,255,255,${rand() * 0.4 + 0.1})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  textureCache.set(key, tex);
  return tex;
}

// ─── Ring Texture Generator ──────────────────────────────────────────────────
function createRingTexture(seed: number): THREE.CanvasTexture {
  const key = `ring-${seed}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1;
  const ctx = canvas.getContext("2d")!;

  let rng = seed;
  const rand = () => {
    rng = (rng * 16807 + 0) % 2147483647;
    return (rng - 1) / 2147483646;
  };

  for (let x = 0; x < 1024; x++) {
    const ratio = x / 1024;
    const alpha = ratio > 0.3 && ratio < 0.9
        ? (rand() * 0.6 + 0.2) * Math.sin((ratio - 0.3) / 0.6 * Math.PI)
        : 0;
    const brightness = rand() * 40 + 180;
    ctx.fillStyle = `rgba(${brightness},${brightness * 0.85},${brightness * 0.7},${alpha})`;
    ctx.fillRect(x, 0, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  textureCache.set(key, tex);
  return tex;
}

// ─── Planet Component ────────────────────────────────────────────────────────
interface PlanetProps {
  position: [number, number, number];
  size: number;
  colors: string[];
  rotationSpeed: number;
  orbitSpeed: number;
  orbitRadius: number;
  orbitOffset: number;
  tilt: number;
  hasRings?: boolean;
  hasAtmosphere?: boolean;
  planetType: "earth" | "gas" | "rocky";
  seed: number;
}

const Planet = memo(function Planet({
                                      position,
                                      size,
                                      colors,
                                      rotationSpeed,
                                      orbitSpeed,
                                      orbitRadius,
                                      orbitOffset,
                                      tilt,
                                      hasRings,
                                      hasAtmosphere,
                                      planetType,
                                      seed,
                                    }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosRef1 = useRef<THREE.Mesh>(null);
  const atmosRef2 = useRef<THREE.Mesh>(null);

  const [albedo, normal, roughness, displacement] = useMemo(
      () => [
        createPBRTexture("albedo", planetType, colors, seed),
        createPBRTexture("normal", planetType, colors, seed),
        createPBRTexture("roughness", planetType, colors, seed),
        createPBRTexture("displacement", planetType, colors, seed),
      ],
      [planetType, colors, seed]
  );

  const cloudTex = useMemo(() => createCloudTexture(seed + 100), [seed]);
  const ringTex = useMemo(() => createRingTexture(seed + 200), [seed]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y += rotationSpeed * 1.3;
    }

    if (groupRef.current) {
      const angle = t * orbitSpeed + orbitOffset;
      groupRef.current.position.x = position[0] + Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = position[2] + Math.sin(angle) * orbitRadius;
      groupRef.current.position.y = position[1] + Math.sin(angle * 2) * 0.15;
    }

    // Breathing atmosphere
    if (atmosRef1.current) {
      const breath = 1 + Math.sin(t * 0.5) * 0.005;
      atmosRef1.current.scale.setScalar(breath);
    }
    if (atmosRef2.current) {
      const breath = 1 + Math.sin(t * 0.3 + 1) * 0.008;
      atmosRef2.current.scale.setScalar(breath);
    }
  });

  return (
      <group ref={groupRef} position={position}>
        <mesh ref={meshRef} rotation={[tilt, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
              map={albedo}
              normalMap={normal}
              roughnessMap={roughness}
              displacementMap={displacement}
              displacementScale={planetType === "rocky" ? size * 0.03 : size * 0.01}
              roughness={planetType === "gas" ? 0.4 : 0.85}
              metalness={planetType === "gas" ? 0.1 : 0.05}
              envMapIntensity={0.4}
          />
        </mesh>

        {/* Cloud layer */}
        {planetType === "earth" && (
            <mesh ref={cloudRef} rotation={[tilt, 0, 0]}>
              <sphereGeometry args={[size * 1.015, 64, 64]} />
              <meshStandardMaterial
                  map={cloudTex}
                  transparent
                  opacity={0.6}
                  depthWrite={false}
                  side={THREE.DoubleSide}
              />
            </mesh>
        )}

        {/* Atmosphere shells */}
        {hasAtmosphere && (
            <>
              <mesh ref={atmosRef1}>
                <sphereGeometry args={[size * 1.04, 32, 32]} />
                <meshStandardMaterial
                    color="#87CEEB"
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
              </mesh>
              <mesh ref={atmosRef2}>
                <sphereGeometry args={[size * 1.08, 32, 32]} />
                <meshStandardMaterial
                    color="#4A90E2"
                    transparent
                    opacity={0.04}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
              </mesh>
            </>
        )}

        {/* Rings */}
        {hasRings && (
            <group rotation={[Math.PI / 2.3, 0, 0]}>
              <mesh receiveShadow>
                <ringGeometry args={[size * 1.3, size * 2.0, 128]} />
                <meshStandardMaterial
                    map={ringTex}
                    transparent
                    opacity={0.9}
                    side={THREE.DoubleSide}
                    roughness={0.9}
                    metalness={0.1}
                    depthWrite={false}
                />
              </mesh>
              <mesh>
                <ringGeometry args={[size * 2.1, size * 2.4, 128]} />
                <meshStandardMaterial
                    map={ringTex}
                    transparent
                    opacity={0.5}
                    side={THREE.DoubleSide}
                    roughness={0.95}
                    depthWrite={false}
                />
              </mesh>
            </group>
        )}
      </group>
  );
});

// ─── Moon Component ────────────────────────────────────────────────────────────
interface MoonProps {
  parentPosition: [number, number, number];
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  seed: number;
}

const Moon = memo(function Moon({
                                  parentPosition,
                                  size,
                                  orbitRadius,
                                  orbitSpeed,
                                  orbitOffset,
                                  seed,
                                }: MoonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const [albedo, normal, roughness] = useMemo(
      () => [
        createPBRTexture("albedo", "rocky", ["#C0C0C0", "#A0A0A0", "#D0D0D0"], seed),
        createPBRTexture("normal", "rocky", ["#C0C0C0"], seed),
        createPBRTexture("roughness", "rocky", ["#C0C0C0"], seed),
      ],
      [seed]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (groupRef.current) {
      const angle = t * orbitSpeed + orbitOffset;
      groupRef.current.position.x = parentPosition[0] + Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = parentPosition[2] + Math.sin(angle) * orbitRadius;
      groupRef.current.position.y = parentPosition[1] + Math.sin(angle) * 0.1;
    }
  });

  return (
      <group ref={groupRef} position={parentPosition}>
        <mesh ref={meshRef} castShadow receiveShadow>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
              map={albedo}
              normalMap={normal}
              roughnessMap={roughness}
              roughness={0.95}
              metalness={0.02}
          />
        </mesh>
      </group>
  );
});

// ─── Sun Component ─────────────────────────────────────────────────────────────
const Sun = memo(function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.001;
      const pulse = 1 + Math.sin(t * 0.8) * 0.02;
      coronaRef.current.scale.setScalar(pulse);
    }
    if (corona2Ref.current) {
      corona2Ref.current.rotation.x += 0.0005;
      const pulse = 1 + Math.sin(t * 0.5 + 2) * 0.03;
      corona2Ref.current.scale.setScalar(pulse);
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 0.3) * 0.04;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
      <group position={[-12, 0, -8]}>
        {/* Sun core — reduced emissive intensity */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
              color="#E8A317"
              emissive="#FDB813"
              emissiveIntensity={1.2}
              roughness={0.2}
              metalness={0.05}
              toneMapped={false}
          />
        </mesh>

        {/* Inner corona — softer, less opaque */}
        <mesh ref={coronaRef}>
          <sphereGeometry args={[1.65, 32, 32]} />
          <meshStandardMaterial
              color="#FFD54F"
              transparent
              opacity={0.12}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
          />
        </mesh>

        {/* Outer corona — even softer */}
        <mesh ref={corona2Ref}>
          <sphereGeometry args={[1.95, 32, 32]} />
          <meshStandardMaterial
              color="#FFB74D"
              transparent
              opacity={0.06}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
          />
        </mesh>

        {/* Wide ambient glow — very subtle */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[2.8, 16, 16]} />
          <meshStandardMaterial
              color="#FFCC80"
              transparent
              opacity={0.025}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
          />
        </mesh>

        {/* Sun light — reduced intensity, softer falloff */}
        <pointLight intensity={2.5} distance={50} color="#FDB813" decay={2} />
        <pointLight intensity={0.8} distance={80} color="#FFA726" decay={2} />
      </group>
  );
});
// ─── Starfield with InstancedMesh ──────────────────────────────────────────────
const Starfield = memo(function Starfield({ count = 3000 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 40 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      const temp = Math.random();
      if (temp < 0.7) {
        col[i3] = 1; col[i3 + 1] = 1; col[i3 + 2] = 1;
      } else if (temp < 0.85) {
        col[i3] = 0.75; col[i3 + 1] = 0.85; col[i3 + 2] = 1;
      } else if (temp < 0.95) {
        col[i3] = 1; col[i3 + 1] = 0.95; col[i3 + 2] = 0.8;
      } else {
        col[i3] = 1; col[i3 + 1] = 0.75; col[i3 + 2] = 0.7;
      }

      sz[i] = Math.random() * 0.08 + 0.02;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(sizes[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]));
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [positions, colors, sizes, count, dummy]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });

  return (
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial />
      </instancedMesh>
  );
});

// ─── Camera Controller ─────────────────────────────────────────────────────────
function CameraController() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 15));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Subtle cinematic drift
    targetPos.current.x = Math.sin(t * 0.1) * 0.3;
    targetPos.current.y = Math.cos(t * 0.07) * 0.2;
    camera.position.lerp(targetPos.current, 0.02);
    camera.lookAt(0, 0, -3);
  });

  return null;
}

// ─── Post Processing ───────────────────────────────────────────────────────────
function PostProcessing() {
  return (
      <EffectComposer>
        <Bloom
            intensity={1.2}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            mipmapBlur
        />
        <ToneMapping mode={THREE.ACESFilmicToneMapping} />
      </EffectComposer>
  );
}

// ─── Main Scene ────────────────────────────────────────────────────────────────
export default function Scene3D() {
  const earthPos: [number, number, number] = [0, 0, -3];

  return (
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
            camera={{ position: [0, 0, 15], fov: 55, near: 0.1, far: 200 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              logarithmicDepthBuffer: true,
            }}
            shadows
        >

          {/* Enhanced lighting setup */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[10, 5, 5]} intensity={2.5} color="#ffffff" castShadow />
          <pointLight position={[-15, 0, 0]} intensity={1.5} color="#ffa500" />
          <pointLight position={[15, -10, 5]} intensity={0.8} color="#87CEEB" />

          <CameraController />

          {/* Sun */}
          <Sun />

          {/* Mercury */}
          <Planet
              position={[-8, 1, -5]}
              size={0.35}
              colors={["#8C7853", "#6B5D47", "#9A8A6F"]}
              rotationSpeed={0.004}
              orbitSpeed={0.5}
              orbitRadius={0.3}
              orbitOffset={0}
              tilt={0.03}
              planetType="rocky"
              seed={1}
          />

          {/* Venus */}
          <Planet
              position={[-5, -2, -4]}
              size={0.65}
              colors={["#FFC649", "#E8B84D", "#FFD873"]}
              rotationSpeed={0.002}
              orbitSpeed={0.35}
              orbitRadius={0.4}
              orbitOffset={1.5}
              tilt={0.05}
              planetType="rocky"
              seed={2}
          />

          {/* Earth */}
          <Planet
              position={earthPos}
              size={0.7}
              colors={["#1a5276", "#2E7D32", "#1565C0"]}
              rotationSpeed={0.01}
              orbitSpeed={0.2}
              orbitRadius={0.5}
              orbitOffset={3.0}
              tilt={0.41}
              hasAtmosphere
              planetType="earth"
              seed={3}
          />

          {/* Moon */}
          <Moon
              parentPosition={earthPos}
              size={0.2}
              orbitRadius={1.4}
              orbitSpeed={0.8}
              orbitOffset={0}
              seed={33}
          />

          {/* Mars */}
          <Planet
              position={[4, 2, -3]}
              size={0.5}
              colors={["#E27B58", "#C1440E", "#D84315"]}
              rotationSpeed={0.009}
              orbitSpeed={0.15}
              orbitRadius={0.4}
              orbitOffset={4.5}
              tilt={0.44}
              planetType="rocky"
              seed={4}
          />

          {/* Jupiter */}
          <Planet
              position={[7, -1, -6]}
              size={1.3}
              colors={["#C88B3A", "#D4A574", "#B87333", "#E6B87D"]}
              rotationSpeed={0.02}
              orbitSpeed={0.08}
              orbitRadius={0.6}
              orbitOffset={1.0}
              tilt={0.05}
              planetType="gas"
              seed={5}
          />

          {/* Saturn */}
          <Planet
              position={[-6, 3, -7]}
              size={1.1}
              colors={["#FAD5A5", "#E8C89A", "#F5DEB3"]}
              rotationSpeed={0.018}
              orbitSpeed={0.06}
              orbitRadius={0.5}
              orbitOffset={2.5}
              tilt={0.47}
              hasRings
              planetType="gas"
              seed={6}
          />

          {/* Uranus */}
          <Planet
              position={[9, 1, -8]}
              size={0.8}
              colors={["#4FD0E7", "#5DD9ED", "#3FBFD9"]}
              rotationSpeed={0.012}
              orbitSpeed={0.04}
              orbitRadius={0.7}
              orbitOffset={5.0}
              tilt={1.71}
              planetType="gas"
              seed={7}
          />

          {/* Neptune */}
          <Planet
              position={[-9, -2, -9]}
              size={0.78}
              colors={["#4166F5", "#2E4EC9", "#5A7FFF"]}
              rotationSpeed={0.011}
              orbitSpeed={0.03}
              orbitRadius={0.6}
              orbitOffset={6.0}
              tilt={0.49}
              planetType="gas"
              seed={8}
          />

          {/* Starfield */}
          <Starfield count={2000} />

          {/* Controls */}
          <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.15}
              enableDamping
              dampingFactor={0.05}
              rotateSpeed={0.3}
              minPolarAngle={Math.PI * 0.3}
              maxPolarAngle={Math.PI * 0.7}
          />

          {/* Post Processing */}
          <PostProcessing />
        </Canvas>
      </div>
  );
}