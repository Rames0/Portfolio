"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

export function AntigravityBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect hardware & reduced motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 650 : 1350;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspect = width / height;

    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    camera.position.z = 5.5;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 3. Geometry & Attributes
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    // Palette: Antigravity Google signature palette (emerald, cyan, sky blue, mint, cosmic white)
    const darkPalette = [
      new THREE.Color("#10b981"), // Emerald
      new THREE.Color("#06b6d4"), // Cyan
      new THREE.Color("#38bdf8"), // Sky Azure
      new THREE.Color("#34d399"), // Mint
      new THREE.Color("#ffffff"), // Pure luminous starpoint
    ];

    const lightPalette = [
      new THREE.Color("#059669"),
      new THREE.Color("#0891b2"),
      new THREE.Color("#2563eb"),
      new THREE.Color("#10b981"),
      new THREE.Color("#475569"),
    ];

    const activePalette = isDark ? darkPalette : lightPalette;

    for (let i = 0; i < particleCount; i++) {
      // Spatial distribution across 3D field
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      phases[i] = Math.random() * Math.PI * 2;
      scales[i] = Math.random() * 0.65 + 0.45;

      const col =
        activePalette[Math.floor(Math.random() * activePalette.length)];
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    // 4. Custom GLSL Shader Material
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-999, -999) },
      uAspect: { value: aspect },
      uScrollOffset: { value: 0 },
    };

    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uAspect;
      uniform float uScrollOffset;

      attribute float aPhase;
      attribute float aScale;
      attribute vec3 aColor;

      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        vec3 pos = position;

        // Harmonic Superposition (Weightless Antigravity Breathing Wave)
        pos.y += sin(uTime * 0.85 + aPhase) * 0.18 + cos(uTime * 0.45 + aPhase * 1.6) * 0.08;
        pos.x += cos(uTime * 0.65 + aPhase * 2.0) * 0.14;
        pos.z += sin(uTime * 0.5 + aPhase) * 0.22;

        // Scroll velocity & offset displacement
        pos.y -= uScrollOffset * 0.0018;

        // Interactive Cursor Antigravity Repulsion Field
        vec2 screenPos = pos.xy;
        screenPos.x *= uAspect;
        float dist = distance(screenPos, uMouse);
        float repelRadius = 0.85;

        if (dist < repelRadius && dist > 0.001) {
          float force = pow(1.0 - dist / repelRadius, 1.8);
          vec2 dir = normalize(screenPos - uMouse);
          pos.xy += dir * force * 0.48;
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Inverse distance point sizing
        gl_PointSize = (aScale * 38.0) / -mvPosition.z;

        // Distance fog / depth falloff
        vAlpha = smoothstep(0.05, 0.95, 1.0 - (-mvPosition.z / 14.0));
        vColor = aColor;
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);

        if (dist > 0.5) discard;

        // Soft luminous glowing disc
        float strength = pow(smoothstep(0.5, 0.0, dist), 1.6);
        gl_FragColor = vec4(vColor, strength * vAlpha * 0.95);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 5. Input Tracking (Mouse + Scroll)
    const mouseTarget = new THREE.Vector2(-999, -999);
    let scrollOffset = window.scrollY;
    let targetScrollOffset = window.scrollY;

    const onPointerMove = (e: PointerEvent) => {
      mouseTarget.x = ((e.clientX / width) * 2 - 1) * aspect;
      mouseTarget.y = -(e.clientY / height) * 2 + 1;
    };

    const onPointerLeave = () => {
      mouseTarget.set(-999, -999);
    };

    const onScroll = () => {
      targetScrollOffset = window.scrollY;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // 6. Resize handler
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      aspect = width / height;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      uniforms.uAspect.value = aspect;
    };

    window.addEventListener("resize", onResize, { passive: true });

    // 7. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const elapsed = (time - startTime) * 0.001;
      uniforms.uTime.value = prefersReducedMotion ? elapsed * 0.2 : elapsed;

      // Smooth pointer lerp
      uniforms.uMouse.value.lerp(mouseTarget, 0.08);

      // Smooth scroll interpolation
      scrollOffset += (targetScrollOffset - scrollOffset) * 0.06;
      uniforms.uScrollOffset.value = scrollOffset;

      // Subtle camera breathing
      if (!prefersReducedMotion) {
        camera.position.x = Math.sin(elapsed * 0.15) * 0.15;
        camera.position.y = Math.cos(elapsed * 0.12) * 0.15;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <>
      {/* Three.js Antigravity WebGL Canvas Container */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ width: "100vw", height: "100vh" }}
      />

      {/* Atmospheric Vignette & Lighting matching Google Antigravity */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(16, 185, 129, 0.14), transparent 75%), radial-gradient(ellipse 60% 40% at 90% 70%, rgba(6, 182, 212, 0.08), transparent 70%)"
            : "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(5, 150, 105, 0.09), transparent 75%), radial-gradient(ellipse 60% 40% at 90% 70%, rgba(8, 145, 178, 0.06), transparent 70%)",
        }}
      />
    </>
  );
}
