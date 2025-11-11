"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, Mail, Instagram, Linkedin, Github, Twitter } from "lucide-react";
import { memo, useCallback } from "react";

const Sidebar = memo(function Sidebar() {
  const handleHireMe = useCallback(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative mx-auto mt-6 mb-6 lg:fixed lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:mt-0 lg:mb-0 w-full max-w-sm lg:max-w-none lg:w-80 z-50"
    >
      <Card className="bg-white/5 backdrop-blur-xl border border-emerald-400/30 rounded-2xl lg:rounded-3xl p-5 lg:p-6 flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative z-10">
        <div className="text-center mb-5 lg:mb-6">
          <div className="flex items-center justify-center gap-2 mb-3 lg:mb-4">
            <User className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Full-Stack Web Developer</span>
          </div>
        </div>

        <motion.div 
          className="mb-5 lg:mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 shadow-[0_4px_16px_0_rgba(16,185,129,0.2)]">
            <img 
              src="/Profile.jpeg" 
              alt="Ramesh Profile" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        <div className="space-y-1 mb-5 lg:mb-6 text-center">
          <a href="mailto:mhrjan0@gmail.com" className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors">
            mhrjan0@gmail.com
          </a>
          <p className="text-sm text-gray-400">Kathmandu, Nepal</p>
        </div>

        <div className="text-center text-xs text-gray-600 mb-5 lg:mb-6">
          © 2025 Ramesh. All Rights Reserved
        </div>

        <div className="flex justify-center gap-3 mb-5 lg:mb-6">
          {[
            { icon: <Instagram className="w-4 h-4" />, url: "#" },
            { icon: <Linkedin className="w-4 h-4" />, url: "#" },
            { icon: <Github className="w-4 h-4" />, url: "#" },
            { icon: <Twitter className="w-4 h-4" />, url: "#" }
          ].map((social, i) => (
            <motion.a 
              key={i} 
              href={social.url}
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-400 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] hover:shadow-[0_4px_16px_0_rgba(16,185,129,0.3)] active:scale-95"
            >
              {social.icon}
            </motion.a>
          ))}
        </div>

        <Button onClick={handleHireMe} className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-semibold rounded-full py-5 lg:py-6 text-base shadow-[0_4px_16px_0_rgba(16,185,129,0.4)] hover:shadow-[0_8px_24px_0_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 active:scale-95">
          <Mail className="w-4 h-4 mr-2" />
          HIRE ME!
        </Button>
      </Card>
    </motion.aside>
  );
});

export default Sidebar;
