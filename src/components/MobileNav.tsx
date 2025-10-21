"use client";

import { useState, useEffect } from 'react';
import { X, Home, User, Zap, Briefcase, Layers, Mail } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

export default function MobileNav({ isOpen, onClose, activeSection }: MobileNavProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Skills', href: '#skills', icon: Zap },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Projects', href: '#projects', icon: Layers },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  const handleNavClick = (href: string) => {
    onClose();
    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 bg-slate-950/95 backdrop-blur-xl border-l border-white/10 shadow-[-8px_0_32px_0_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            RAMESH.DEV
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200 shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="p-6">
          <div className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.name.toLowerCase();
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 active:scale-95 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white shadow-[0_4px_16px_0_rgba(6,182,212,0.3)]' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 shadow-[0_2px_8px_0_rgba(0,0,0,0.2)]'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-300 font-medium">Available for opportunities</span>
            </div>
            <p className="text-xs text-gray-400">
              Full Stack Developer from Nepal 🇳🇵
            </p>
          </div>
        </div>
      </div>
    </>
  );
}