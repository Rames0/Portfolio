"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Award, Layers } from "lucide-react";
import { memo } from "react";
import Card3D from "./Card3D";

const AboutSection = memo(function AboutSection() {
  return (
      <section id="about" className="min-h-screen flex flex-col justify-center py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
          className="px-4 sm:px-6 md:px-0"
      >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 mb-6 sm:mb-8 bg-white/5 backdrop-blur shadow-[0_2px_8px_0_rgba(0,0,0,0.3)]">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm text-gray-400">ABOUT ME</span>
        </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-10 sm:mb-16">
          Crafting Digital <span className="text-emerald-400">Excellence</span>
        </h2>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 md:gap-16">
          <Card3D>
              <Card className="bg-white/5 backdrop-blur-xl border border-emerald-400/30 p-6 sm:p-8 h-full rounded-2xl shadow-[0_8px_32px_0_rgba(16,185,129,0.2)] hover:shadow-[0_12px_48px_0_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4 shadow-[0_8px_24px_0_rgba(16,185,129,0.4)]">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
                <h3 className="text-white text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Experience</h3>
                <p className="text-gray-300 text-sm sm:text-base">1 year building enterprise applications with modern tech stack</p>
            </Card>
          </Card3D>

          <Card3D>
              <Card className="bg-white/5 backdrop-blur-xl border border-blue-400/30 p-6 sm:p-8 h-full rounded-2xl shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_12px_48px_0_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-[0_8px_24px_0_rgba(59,130,246,0.4)]">
                  <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
                <h3 className="text-white text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Projects</h3>
                <p className="text-gray-300 text-sm sm:text-base">6+ major projects including government portals and POS systems</p>
            </Card>
          </Card3D>
        </div>
      </motion.div>
    </section>
  );
});

export default AboutSection;
