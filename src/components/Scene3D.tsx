"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useMemo, memo, useCallback } from "react";
import * as THREE from "three";

// Enhanced texture cache with higher quality
const textureCache = new Map<string, THREE.CanvasTexture>();

// Realistic planet texture generator with enhanced details
const createRealisticPlanetTexture = (planetType: string, colors: string[], size: number) => {
  const textureKey = `${planetType}-${colors.join('-')}-${size}`;
  
  if (textureCache.has(textureKey)) {
    return textureCache.get(textureKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024; // Higher resolution for better quality
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (planetType === 'earth') {
    // Earth-like texture with continents and oceans
    ctx.fillStyle = colors[0]; // Ocean blue
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add continents with realistic shapes
    const continents = [
      { x: 200, y: 300, width: 300, height: 200, color: colors[1] },
      { x: 600, y: 200, width: 250, height: 180, color: colors[1] },
      { x: 100, y: 600, width: 200, height: 150, color: colors[1] },
      { x: 700, y: 500, width: 180, height: 200, color: colors[1] },
      { x: 400, y: 700, width: 220, height: 120, color: colors[1] }
    ];
    
    continents.forEach(continent => {
      ctx.fillStyle = continent.color;
      ctx.beginPath();
      ctx.ellipse(continent.x, continent.y, continent.width/2, continent.height/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add mountain ranges
      ctx.fillStyle = '#8B4513';
      for (let i = 0; i < 20; i++) {
        const x = continent.x + (Math.random() - 0.5) * continent.width;
        const y = continent.y + (Math.random() - 0.5) * continent.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 15 + 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Add cloud patterns
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 20 + 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
  } else if (planetType === 'gas') {
    // Gas giant with swirling patterns
    const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.3, colors[1]);
    gradient.addColorStop(0.6, colors[2] || colors[1]);
    gradient.addColorStop(1, colors[3] || colors[2] || colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add swirling bands
    for (let y = 0; y < 1024; y += 8) {
      const bandColor = y % 64 < 32 ? colors[1] : colors[2] || colors[1];
      ctx.fillStyle = bandColor;
      ctx.globalAlpha = 0.7 + Math.sin(y * 0.1) * 0.3;
      ctx.fillRect(0, y, 1024, 8);
    }
    
    // Add storm systems
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 50 + 20;
      
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.4 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add swirling effect
      ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
      ctx.stroke();
    }
    
  } else if (planetType === 'rocky') {
    // Rocky planet with craters and surface details
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add surface variations
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 30 + 10;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.6 + Math.random() * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add craters
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 25 + 5;
      
      // Crater rim
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Crater interior
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.beginPath();
      ctx.arc(x + radius * 0.2, y + radius * 0.2, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    
  } else {
    // Default solid color
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, 1024, 1024);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  
  textureCache.set(textureKey, tex);
  return tex;
};

const Planet = memo(function Planet({ position, size, colors, rotationSpeed, orbitSpeed, scrollSpeed, tilt, hasRings, hasAtmosphere, planetType }: { 
  position: [number, number, number]; 
  size: number; 
  colors: string[];
  rotationSpeed: number;
  orbitSpeed: number;
  scrollSpeed: number;
  tilt: number;
  hasRings?: boolean;
  hasAtmosphere?: boolean;
  planetType: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scrollYRef = useRef(0);
  const lastScrollY = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Use the new realistic texture generator
  const texture = useMemo(() => {
    return createRealisticPlanetTexture(planetType, colors, size);
  }, [planetType, colors, size]);
  
  // Super smooth scroll handler with interpolation
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Only update if scroll changed significantly
    if (Math.abs(currentScrollY - lastScrollY.current) < 0.5) return;
    
    lastScrollY.current = currentScrollY;
    
    // Cancel previous animation frame for smooth updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      scrollYRef.current = currentScrollY;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x = tilt;
    }
    
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.position.x = position[0] + Math.sin(time * orbitSpeed) * 0.5;
      groupRef.current.position.z = position[2] + Math.cos(time * orbitSpeed) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          roughness={planetType === 'gas' ? 0.3 : 0.8}
          metalness={planetType === 'gas' ? 0.2 : 0.1}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          envMapIntensity={0.3}
        />
      </mesh>
      
      {/* Enhanced atmosphere with multiple layers */}
      {hasAtmosphere && (
        <>
          <mesh>
            <sphereGeometry args={[size * 1.02, 32, 32]} />
            <meshStandardMaterial 
              color="#87CEEB"
              transparent 
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[size * 1.05, 32, 32]} />
            <meshStandardMaterial 
              color="#4A90E2"
              transparent 
              opacity={0.1}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}
      
      {/* Enhanced rings with better detail */}
      {hasRings && (
        <group rotation={[Math.PI / 2.5, 0, 0]}>
          <mesh>
            <ringGeometry args={[size * 1.4, size * 1.8, 64]} />
            <meshStandardMaterial 
              color="#D4A574" 
              transparent 
              opacity={0.8} 
              side={THREE.DoubleSide} 
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[size * 1.8, size * 2.2, 64]} />
            <meshStandardMaterial 
              color="#C0A080" 
              transparent 
              opacity={0.6} 
              side={THREE.DoubleSide} 
              roughness={0.9}
            />
          </mesh>
        </group>
      )}
    </group>
  );
});

const Moon = memo(function Moon({ earthPosition, size }: { earthPosition: [number, number, number]; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollYRef = useRef(0);
  const lastScrollY = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (Math.abs(currentScrollY - lastScrollY.current) < 0.5) return;
    
    lastScrollY.current = currentScrollY;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      scrollYRef.current = currentScrollY;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  const moonTexture = useMemo(() => {
    if (textureCache.has('moon-realistic')) {
      return textureCache.get('moon-realistic')!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Base moon surface
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add surface variations
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 20 + 5;
      ctx.fillStyle = `rgba(160,160,160,${Math.random() * 0.5 + 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add realistic craters
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 40 + 10;
      
      // Crater shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Crater rim highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2);
      ctx.stroke();
      
      // Crater interior
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.arc(x + radius * 0.3, y + radius * 0.3, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    textureCache.set('moon-realistic', tex);
    return tex;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const angle = time * 0.5;
      
      meshRef.current.position.x = earthPosition[0] + Math.cos(angle) * 1.5;
      meshRef.current.position.z = earthPosition[2] + Math.sin(angle) * 1.5;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        map={moonTexture} 
        roughness={0.9} 
        metalness={0.05}
        normalScale={new THREE.Vector2(0.3, 0.3)}
      />
    </mesh>
  );
});

const Stars = memo(function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const scrollYRef = useRef(0);
  const lastScrollY = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const count = 600; // Increased for more realistic starfield
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // More realistic star distribution
      pos[i3] = (Math.random() - 0.5) * 100;
      pos[i3 + 1] = (Math.random() - 0.5) * 100;
      pos[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // Vary star colors (white, blue, yellow, red)
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 1; // White
      } else if (colorChoice < 0.85) {
        colors[i3] = 0.8; colors[i3 + 1] = 0.9; colors[i3 + 2] = 1; // Blue
      } else if (colorChoice < 0.95) {
        colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 0.8; // Yellow
      } else {
        colors[i3] = 1; colors[i3 + 1] = 0.8; colors[i3 + 2] = 0.8; // Red
      }
    }
    
    return { positions: pos, colors };
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (Math.abs(currentScrollY - lastScrollY.current) < 0.5) return;
    
    lastScrollY.current = currentScrollY;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      scrollYRef.current = currentScrollY;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  useFrame(() => {
    if (starsRef.current) {
      const time = Date.now() * 0.0001;
      starsRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[positions.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        vertexColors 
        transparent 
        opacity={0.9}
        sizeAttenuation={true}
      />
    </points>
  );
});

export default function Scene3D() {
  const earthPos: [number, number, number] = [0, 0, -3];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 60 }} 
        frameloop="demand" 
        dpr={[1, 2]} 
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true
        }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 5, 5]} intensity={2.5} color="#ffffff" castShadow />
        <pointLight position={[-15, 0, 0]} intensity={1.5} color="#ffa500" />
        <pointLight position={[15, -10, 5]} intensity={0.8} color="#87CEEB" />
        
        {/* Enhanced Sun with corona effect */}
        <group position={[-12, 0, -8]}>
          <mesh>
            <sphereGeometry args={[1.5, 64, 64]} />
            <meshStandardMaterial 
              color="#FDB813" 
              emissive="#FDB813" 
              emissiveIntensity={2}
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>
          {/* Sun corona */}
          <mesh>
            <sphereGeometry args={[1.8, 32, 32]} />
            <meshStandardMaterial 
              color="#FFD700" 
              transparent 
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
          <pointLight intensity={4} distance={25} color="#FDB813" />
        </group>
        
        {/* Enhanced planets with realistic colors and textures */}
        <Planet position={[-8, 1, -5]} size={0.4} colors={['#8C7853', '#6B5D47', '#9A8A6F']} rotationSpeed={0.004} orbitSpeed={0.4} scrollSpeed={0.5} tilt={0.03} planetType="rocky" />
        
        <Planet position={[-5, -2, -4]} size={0.7} colors={['#FFC649', '#E8B84D', '#FFD873']} rotationSpeed={0.002} orbitSpeed={0.3} scrollSpeed={0.4} tilt={0.05} planetType="rocky" />
        
        <Planet position={earthPos} size={0.8} colors={['#4A90E2', '#2E7D32', '#1565C0']} rotationSpeed={0.01} orbitSpeed={0.2} scrollSpeed={0.3} tilt={0.41} hasAtmosphere planetType="earth" />
        
        <Moon earthPosition={earthPos} size={0.25} />
        
        <Planet position={[4, 2, -3]} size={0.6} colors={['#E27B58', '#C1440E', '#D84315']} rotationSpeed={0.009} orbitSpeed={0.15} scrollSpeed={0.35} tilt={0.44} planetType="rocky" />
        
        <Planet position={[7, -1, -6]} size={1.4} colors={['#C88B3A', '#D4A574', '#B87333', '#E6B87D']} rotationSpeed={0.02} orbitSpeed={0.08} scrollSpeed={0.25} tilt={0.05} planetType="gas" />
        
        <Planet position={[-6, 3, -7]} size={1.2} colors={['#FAD5A5', '#E8C89A', '#F5DEB3']} rotationSpeed={0.018} orbitSpeed={0.06} scrollSpeed={0.2} tilt={0.47} hasRings planetType="gas" />
        
        <Planet position={[9, 1, -8]} size={0.9} colors={['#4FD0E7', '#5DD9ED', '#3FBFD9']} rotationSpeed={0.012} orbitSpeed={0.04} scrollSpeed={0.15} tilt={1.71} planetType="gas" />
        
        <Planet position={[-9, -2, -9]} size={0.85} colors={['#4166F5', '#2E4EC9', '#5A7FFF']} rotationSpeed={0.011} orbitSpeed={0.03} scrollSpeed={0.1} tilt={0.49} planetType="gas" />
        
        <Stars />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
