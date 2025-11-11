"use client";

import { motion } from "framer-motion";
import { Home as HomeIcon, User, Code, Briefcase, Rocket, Folder, MessageSquare } from "lucide-react";
import { memo, useCallback, useState, useEffect } from "react";

interface NavigationProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const Navigation = memo(function Navigation({ activeSection, scrollToSection }: NavigationProps) {
  const [showNav, setShowNav] = useState(false);

  const navItems = [
    { icon: <HomeIcon />, id: 'home' },
    { icon: <User />, id: 'about' },
    { icon: <Code />, id: 'skills' },
    { icon: <Briefcase />, id: 'experience' },
    { icon: <Rocket />, id: 'services' },
    { icon: <Folder />, id: 'projects' },
    { icon: <MessageSquare />, id: 'contact' }
  ];

  const handleClick = useCallback((sectionId: string) => {
    scrollToSection(sectionId);
  }, [scrollToSection]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setShowNav(window.scrollY > 600);
      } else {
        setShowNav(true);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (!showNav) return null;

  return (
    <nav className="hidden lg:flex fixed right-4 xl:right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 xl:gap-6">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => handleClick(item.id)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`w-10 h-10 xl:w-12 xl:h-12 rounded-full border flex items-center justify-center transition-all ${
            activeSection === item.id 
              ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10 shadow-[0_4px_16px_0_rgba(16,185,129,0.5)]' 
              : 'border-white/10 text-gray-400 hover:text-emerald-400 hover:border-emerald-400 shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] hover:shadow-[0_4px_16px_0_rgba(16,185,129,0.3)]'
          } active:scale-95`}
        >
          <div className="w-4 h-4 xl:w-5 xl:h-5">{item.icon}</div>
        </motion.button>
      ))}
    </nav>
  );
});

export default Navigation;
