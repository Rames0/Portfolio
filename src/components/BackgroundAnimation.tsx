"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

export default function BackgroundAnimation() {
    const radialRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const blob1Ref = useRef<HTMLDivElement>(null);
    const blob2Ref = useRef<HTMLDivElement>(null);
    const blob3Ref = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
    const [mounted, setMounted] = useState(false);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const lastScrollY = useRef(0);
    
    // Memoize particle data to prevent regeneration on every render
    const particlesData = useMemo(() => 
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 15 + Math.random() * 10
        })), []
    );

    // Optimized scroll handler with throttling and GPU acceleration
    const handleScroll = useCallback(() => {
        const scrollY = window.scrollY;
        
        // Only update if scroll position changed significantly (throttling)
        if (Math.abs(scrollY - lastScrollY.current) < 1) return;
        lastScrollY.current = scrollY;

        // Cancel previous animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            const transforms = {
                radial: `translate3d(0, ${scrollY * 0.3}px, 0)`,
                grid: `translate3d(0, ${scrollY * 0.5}px, 0)`,
                blob1: `translate3d(${scrollY * 0.2}px, ${scrollY * 0.4}px, 0)`,
                blob2: `translate3d(-${scrollY * 0.3}px, -${scrollY * 0.2}px, 0)`,
                blob3: `translate3d(-${scrollY * 0.25}px, ${scrollY * 0.35}px, 0)`
            };

            // Batch DOM updates for better performance
            const elements = [
                { ref: radialRef, transform: transforms.radial },
                { ref: gridRef, transform: transforms.grid },
                { ref: blob1Ref, transform: transforms.blob1 },
                { ref: blob2Ref, transform: transforms.blob2 },
                { ref: blob3Ref, transform: transforms.blob3 }
            ];

            elements.forEach(({ ref, transform }) => {
                if (ref.current) {
                    ref.current.style.transform = transform;
                }
            });

            // Update particles with optimized calculations
            particlesRef.current.forEach((particle, i) => {
                if (particle) {
                    particle.style.transform = `translate3d(0, ${scrollY * (0.1 + i * 0.02)}px, 0)`;
                }
            });
        });
    }, []);

    useEffect(() => {
        setMounted(true);
        
        // Use passive listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [handleScroll]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
            
            <div 
                ref={radialRef}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_50%)]"
                style={{ willChange: 'transform' }}
            />
            
            <div 
                ref={gridRef}
                className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem]"
                style={{ willChange: 'transform' }}
            />
            
            <div 
                ref={blob1Ref}
                className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
                style={{ willChange: 'transform' }}
            />
            <div 
                ref={blob2Ref}
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: '1s', willChange: 'transform' }}
            />
            <div 
                ref={blob3Ref}
                className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: '2s', willChange: 'transform' }}
            />
            
            {mounted && particlesData.map((particle, index) => (
                <div
                    key={particle.id}
                    ref={el => { particlesRef.current[index] = el; }}
                    className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-float"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                        willChange: 'transform',
                        transform: 'translateZ(0)' // Force GPU acceleration
                    }}
                />
            ))}
        </div>
    );
}
