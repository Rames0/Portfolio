"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { isReducedMotionEnabled } from "@/lib/useReducedMotion";

export function AntigravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isReducedMotionEnabled()) {
      (window as unknown as { Scene3D?: { warpIn: () => void; setIntroMode: (v: boolean) => void } }).Scene3D = {
        warpIn() {},
        setIntroMode() {},
      };
      window.dispatchEvent(new CustomEvent("scene3d:ready"));
      return;
    }

    const isMobile = window.innerWidth < 760;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const isLightInitial = document.documentElement.getAttribute("data-theme") === "light";
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isLightInitial ? 0xf8fafc : 0x05080f, 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );
    camera.position.set(0, 0, 14);

    // Lights
    scene.add(new THREE.AmbientLight(0x88aacc, 0.45));
    const keyLight = new THREE.PointLight(0x10b981, 40, 60, 1.6);
    keyLight.position.set(6, 6, 8);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x06b6d4, 30, 60, 1.6);
    fillLight.position.set(-8, -4, 6);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x3b82f6, 20, 50, 1.6);
    rimLight.position.set(0, 8, -6);
    scene.add(rimLight);

    // Particle field
    const COUNT = isMobile ? 1200 : 2400;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const palette = [
      new THREE.Color(0x10b981),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0x3b82f6),
      new THREE.Color(0xa7f3d0),
    ];
    for (let i = 0; i < COUNT; i++) {
      const r = 12 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi) - 10;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.6 + Math.random() * 1.6;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: isLightInitial ? THREE.NormalBlending : THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uBurst: { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        uniform float uTime; uniform float uPixelRatio; uniform float uBurst;
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vColor = color;
          vec3 p = position;
          p.y += sin(uTime * 0.4 + position.x * 0.2) * 0.4;
          p.x += cos(uTime * 0.3 + position.z * 0.15) * 0.3;
          p += normalize(position) * uBurst * 6.0;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + position.x * 5.0);
          vAlpha = twinkle;
          gl_PointSize = aSize * uPixelRatio * (28.0 / -mv.z) * (1.0 + uBurst * 1.5);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor; varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor, glow * vAlpha * 0.9);
        }`,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Floating wireframe primitives
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);
    const wireMat = (color: number, opacity = 0.35) =>
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
    const solidMat = (color: number) =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.55,
        emissive: color,
        emissiveIntensity: 0.15,
      });

    const defs: Array<{
      geo: THREE.BufferGeometry;
      pos: [number, number, number];
      mat: THREE.Material;
      spin: [number, number];
    }> = [
      { geo: new THREE.IcosahedronGeometry(1.4, 0), pos: [-7, 3, -4], mat: wireMat(0x10b981, 0.5), spin: [0.003, 0.004] },
      { geo: new THREE.TorusGeometry(1.2, 0.35, 12, 40), pos: [7.5, -2.5, -6], mat: wireMat(0x06b6d4, 0.4), spin: [0.004, 0.002] },
      { geo: new THREE.OctahedronGeometry(1.1, 0), pos: [6, 4.5, -8], mat: solidMat(0x3b82f6), spin: [0.002, 0.005] },
      // { geo: new THREE.DodecahedronGeometry(0.9, 0), pos: [-6.5, -4, -7], mat: solidMat(0x10b981), spin: [0.005, 0.003] },
      { geo: new THREE.TetrahedronGeometry(1.2, 0), pos: [0, -6, -10], mat: wireMat(0x3b82f6, 0.45), spin: [0.003, 0.006] },
      { geo: new THREE.TorusKnotGeometry(0.8, 0.25, 80, 10, 2, 3), pos: [-3, 7, -12], mat: wireMat(0xa7f3d0, 0.3), spin: [0.004, 0.004] },
      { geo: new THREE.BoxGeometry(1.4, 1.4, 1.4), pos: [9, 1, -14], mat: wireMat(0x10b981, 0.3), spin: [0.002, 0.003] },
      { geo: new THREE.IcosahedronGeometry(0.7, 1), pos: [-9, 0, -12], mat: solidMat(0x06b6d4), spin: [0.006, 0.002] },
      { geo: new THREE.ConeGeometry(0.9, 1.6, 6), pos: [3, -8, -16], mat: wireMat(0x06b6d4, 0.35), spin: [0.003, 0.004] },
    ];
    if (isMobile) defs.length = 6;
    const shapes = defs.map((d, i) => {
      const m = new THREE.Mesh(d.geo, d.mat);
      m.position.set(...d.pos);
      m.userData = {
        spin: d.spin,
        baseY: d.pos[1],
        baseZ: d.pos[2],
        phase: i * 0.8,
        amp: 0.4 + Math.random() * 0.5,
      };
      shapesGroup.add(m);
      return m;
    });

    // Central core
    const core = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.4, 0.55, 220, 24, 3, 4),
      new THREE.MeshPhysicalMaterial({
        color: 0x0b2f2a,
        metalness: 0.9,
        roughness: 0.15,
        transparent: true,
        opacity: 0.85,
        emissive: isLightInitial ? 0x059669 : 0x10b981,
        emissiveIntensity: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    );
    core.position.set(isMobile ? 0 : 5, isMobile ? 5 : 1.2, -9);
    core.scale.setScalar(0.001);
    scene.add(core);

    const coreWire = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.55, 0.62, 120, 12, 3, 4),
      wireMat(isLightInitial ? 0x059669 : 0x34d399, isLightInitial ? 0.3 : 0.18),
    );
    coreWire.position.copy(core.position);
    coreWire.scale.setScalar(0.001);
    scene.add(coreWire);

    // Theme update listener
    const updateTheme = () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      if (scene.fog) {
        scene.fog.color.setHex(isLight ? 0xf8fafc : 0x05080f);
      }
      pMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      pMat.needsUpdate = true;
      (core.material as THREE.MeshPhysicalMaterial).emissive.setHex(isLight ? 0x059669 : 0x10b981);
      (coreWire.material as THREE.MeshBasicMaterial).color.setHex(isLight ? 0x059669 : 0x34d399);
      (coreWire.material as THREE.MeshBasicMaterial).opacity = isLight ? 0.32 : 0.18;
    };

    window.addEventListener("theme:change", updateTheme);
    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Interaction state with buttery smooth damping
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollY = window.scrollY;
    let introMode = !document.documentElement.dataset.portfolioEntered;
    let burst = 0;
    let coreScale = introMode ? 0.001 : 1;
    let smoothProgress = 0;
    const damp = (c: number, t: number, k: number, dt: number) =>
      c + (t - c) * (1 - Math.exp(-k * dt));

    const onPointerMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.5 : 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      pMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Public API
    (window as unknown as {
      Scene3D?: {
        warpIn: () => void;
        setIntroMode: (v: boolean) => void;
      };
    }).Scene3D = {
      warpIn() {
        introMode = false;
        burst = 1;
      },
      setIntroMode(v: boolean) {
        introMode = v;
      },
    };

    const startTime = performance.now();
    let visible = true;
    const onVisibilityChange = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let lastT = 0;
    let roll = 0;
    let frameId: number;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      if (!visible) return;
      const now = performance.now();
      const t = (now - startTime) / 1000;
      const dt = Math.min(0.05, t - lastT) || 0.016;
      lastT = t;

      mouse.x = damp(mouse.x, mouse.tx, 3.2, dt);
      mouse.y = damp(mouse.y, mouse.ty, 3.2, dt);

      burst = damp(burst, 0, 2.2, dt);
      pMat.uniforms.uBurst.value = burst;
      pMat.uniforms.uTime.value = t;
      coreScale = damp(coreScale, introMode ? 0.001 : 1, 3, dt);
      core.scale.setScalar(coreScale);
      coreWire.scale.setScalar(coreScale * 1.02);

      const winSmooth = (window as unknown as { Smooth?: { state?: { progress: number; velocity: number } } }).Smooth;
      const S = winSmooth?.state;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const rawProgress = S ? S.progress : scrollY / maxScroll;
      smoothProgress = damp(smoothProgress, rawProgress, 3.5, dt);
      const scrollNorm = smoothProgress;

      const camTargetZ = 14 - scrollNorm * 7;
      const camTargetY = -scrollNorm * 7 + Math.sin(scrollNorm * Math.PI) * 1.2;
      const camTargetX = Math.sin(scrollNorm * Math.PI * 2) * 2.2 + mouse.x * 1.8;
      camera.position.x = damp(camera.position.x, camTargetX, 2.4, dt);
      camera.position.y = damp(camera.position.y, camTargetY + mouse.y * 1.2, 2.4, dt);
      camera.position.z = damp(camera.position.z, camTargetZ, 2.4, dt);
      camera.lookAt(mouse.x * 0.4, camTargetY * 0.6, -6);
      roll = damp(roll, (S ? S.velocity : 0) * -0.0004 + mouse.x * -0.018, 2.4, dt);
      camera.rotateZ(roll);

      particles.rotation.y = t * 0.02 + scrollNorm * 0.9;
      particles.rotation.x = scrollNorm * 0.35;
      shapesGroup.rotation.y = scrollNorm * 1.6;
      shapesGroup.rotation.x = scrollNorm * 0.25;

      shapes.forEach((m) => {
        m.rotation.x += m.userData.spin[0] * dt * 60;
        m.rotation.y += m.userData.spin[1] * dt * 60;
        m.position.y = m.userData.baseY + Math.sin(t * 0.6 + m.userData.phase) * m.userData.amp;
        m.position.z = m.userData.baseZ + scrollNorm * 6;
      });

      core.rotation.x = t * 0.18 + scrollNorm * 2;
      core.rotation.y = t * 0.25 + mouse.x * 0.4;
      core.position.y = (isMobile ? 5 : 1.2) - scrollNorm * 4 + Math.sin(t * 0.7) * 0.25;
      coreWire.rotation.copy(core.rotation);
      coreWire.position.copy(core.position);

      keyLight.position.x = Math.sin(t * 0.4) * 8;
      keyLight.position.z = 6 + Math.cos(t * 0.4) * 4;
      fillLight.intensity = 30 + Math.sin(t * 1.3) * 8;

      renderer.render(scene, camera);
    };

    tick();
    window.dispatchEvent(new CustomEvent("scene3d:ready"));

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("theme:change", updateTheme);
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="scene-canvas" className="scene-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="scene-glow" aria-hidden="true" />
    </>
  );
}
