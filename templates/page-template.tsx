"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ChevronDown, Code, Rocket, Terminal } from "lucide-react";

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-900">
            <div className="fixed inset-0 cyber-grid opacity-30" />
            <div 
                className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl transition-all duration-1000 ease-out pointer-events-none"
                style={{
                    left: mousePosition.x - 192,
                    top: mousePosition.y - 192,
                }}
            />

            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-glow text-purple-400">YOUR_BRAND</div>
                        <Button className="glow-effect bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
                <div className="container mx-auto px-6 text-center">
                    <div className={`space-y-8 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
                        <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                PROFESSIONAL
                            </span>
                            <br />
                            <span className="text-white">NEXT.JS</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            Built with modern technologies and professional design
                        </p>
                        
                        <Button size="lg" className="glow-effect bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg text-white border-0">
                            <Rocket className="w-5 h-5 mr-2" />
                            Get Started
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}