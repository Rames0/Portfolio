"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Eye, Home as HomeIcon, FileText, CheckCircle } from "lucide-react";
import { memo, useCallback, useState } from "react";
import jsPDF from 'jspdf';

const HeroSection = memo(function HeroSection() {
  const handleViewProjects = useCallback(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [cvGenerated, setCvGenerated] = useState(false);

  const generateCV = useCallback(async () => {
    setIsGeneratingCV(true);
    setCvGenerated(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const doc = new jsPDF({ unit: 'mm', format: 'a4' });

      const K   = [0,   0,   0]   as const; // black
      const GR  = [90,  90,  90]  as const; // gray
      const LG  = [160, 160, 160] as const; // light gray
      const WH  = [255, 255, 255] as const; // white
      const OW  = [245, 245, 245] as const; // off-white sidebar

      const PW = 210, PH = 297;
      const SB  = 68;
      const ML  = SB + 8;
      const MR  = 14;
      const MW  = PW - ML - MR;
      const SML = 8;
      const SMW = SB - SML - 4;

      // no sidebar bg

      // white header with bottom border
      doc.setFillColor(...WH);
      doc.rect(0, 0, PW, 46, 'F');
      doc.setDrawColor(...LG);
      doc.setLineWidth(0.4);
      doc.line(0, 46, PW, 46);

      doc.setTextColor(...K);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('RAMESH MAHARJAN', PW / 2, 18, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(...GR);
      doc.text('Full-Stack Developer', PW / 2, 26, { align: 'center' });

      doc.setFontSize(9.5);
      doc.setTextColor(...GR);
      doc.text('React  Next.js  Node.js  Java  Grails  Django  PostgreSQL', PW / 2, 33, { align: 'center' });

      doc.setFontSize(8.5);
      doc.setTextColor(...LG);
      doc.text('mhrjan0@gmail.com   |   Kathmandu, Nepal   |   github.com/ramesh   |   linkedin.com/in/ramesh-mhr', PW / 2, 40, { align: 'center' });
      const headerContactY = 40;
      const headerContactText = 'mhrjan0@gmail.com   |   Kathmandu, Nepal   |   github.com/ramesh   |   linkedin.com/in/ramesh-mhr';
      const hctw = doc.getTextWidth(headerContactText);
      doc.link((PW - hctw) / 2, headerContactY - 3.5, hctw, 4.5, { url: 'mailto:mhrjan0@gmail.com' });

      // sidebar divider (starts after header)
      doc.setFillColor(...LG);
      doc.rect(SB - 0.5, 46, 0.5, PH - 46, 'F');

      let sy = 52;
      let my = 52;

      const sectionHeading = (label: string, x: number, y: number, w: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...K);
        doc.text(label.toUpperCase(), x, y);
        doc.setDrawColor(...K);
        doc.setLineWidth(0.4);
        doc.line(x, y + 1.2, x + w, y + 1.2);
        return y + 5;
      };

      const justifyLine = (line: string, x: number, y: number, w: number) => {
        const words = line.trim().split(' ');
        if (words.length <= 1) { doc.text(line, x, y); return; }
        const totalWordWidth = words.reduce((sum: number, wd: string) => sum + doc.getTextWidth(wd), 0);
        const gap = (w - totalWordWidth) / (words.length - 1);
        let cx = x;
        words.forEach((word: string, wi: number) => {
          doc.text(word, cx, y);
          cx += doc.getTextWidth(word) + (wi < words.length - 1 ? gap : 0);
        });
      };

      const bodyText = (text: string, x: number, y: number, w: number) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...K);
        const lines: string[] = doc.splitTextToSize(text, w);
        lines.forEach((line: string, idx: number) => {
          if (idx === lines.length - 1) doc.text(line, x, y + idx * 4.6);
          else justifyLine(line, x, y + idx * 4.6, w);
        });
        return y + lines.length * 4.6;
      };

      const bullet = (text: string, x: number, y: number, w: number) => {
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...K);
        doc.text('-', x + 0.5, y);
        const bw = w - 4;
        const lines: string[] = doc.splitTextToSize(text, bw);
        lines.forEach((line: string, idx: number) => {
          if (idx === lines.length - 1) doc.text(line, x + 3.5, y + idx * 4.6);
          else justifyLine(line, x + 3.5, y + idx * 4.6, bw);
        });
        return y + lines.length * 4.6;
      };

      const checkMain = (need: number) => {
        if (my + need > PH - 10) {
          doc.addPage();
          // no sidebar bg on new page
          doc.setFillColor(...LG);
          doc.rect(SB - 0.5, 0, 0.5, PH, 'F');
          my = 14;
        }
      };

      // ── SIDEBAR ──────────────────────────────────────────────────────────────

      sy = sectionHeading('Contact', SML, sy, SMW);
      ([
        { label: 'Email',    val: 'mhrjan0@gmail.com',                          url: 'mailto:mhrjan0@gmail.com' },
        { label: 'Location', val: 'Kathmandu, Nepal',                            url: '' },
        { label: 'GitHub',   val: 'github.com/ramesh',                           url: 'https://github.com/ramesh' },
        { label: 'LinkedIn', val: 'linkedin.com/in/ramesh-mhr',                  url: 'https://www.linkedin.com/in/ramesh-mhr-1b0514337/' },
      ]).forEach(({ label, val, url }) => {
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...GR);
        doc.text(label, SML, sy);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(val, SMW);
        const textY = sy + 3.8;
        if (url) {
          doc.setTextColor(0, 0, 200);
          doc.text(lines, SML, textY);
          const tw = doc.getTextWidth(lines[0]);
          doc.link(SML, textY - 3.5, tw, 4.5, { url });
        } else {
          doc.setTextColor(...K);
          doc.text(lines, SML, textY);
        }
        sy += lines.length * 3.8 + 4.5;
      });
      sy += 3;

      sy = sectionHeading('Technical Skills', SML, sy, SMW);
      ([
        { cat: 'Frontend',  items: 'Next.js, React, TypeScript, Tailwind CSS, JavaScript, Html, Css' },
        { cat: 'Backend',   items: 'Node.js, PHP, Laravel, Java, Grails, Django, REST APIs' },
        { cat: 'Database',  items: 'PostgreSQL, MariaDB, MySQL' },
        { cat: 'Tools',     items: 'Git, CI/CD, Linux' },
      ]).forEach(g => {
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...GR);
        doc.text(g.cat, SML, sy);
        sy += 4;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...K);
        const lines = doc.splitTextToSize(g.items, SMW);
        doc.text(lines, SML, sy);
        sy += lines.length * 4.2 + 2;
      });
      sy += 3;

      sy = sectionHeading('Education', SML, sy, SMW);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...K);
      doc.text('Bachelor of Computer', SML, sy);   sy += 4.2;
      doc.text('Applications (BCA)', SML, sy);      sy += 4.2;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...GR);
      doc.text('TU University', SML, sy);               sy += 9;

      sy = sectionHeading('Programming Languages', SML, sy, SMW);
      (['JavaScript', 'TypeScript', 'Python', 'Java', 'PHP'] as string[])
        .forEach((lang: string) => {
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...K);
          doc.text(lang, SML, sy);
          sy += 5.5;
        });

      // ── MAIN CONTENT ─────────────────────────────────────────────────────────

      my = sectionHeading('Professional Summary', ML, my, MW);
      const summaryText =
        'Full-Stack Developer with 1+ year of hands-on experience building enterprise-grade web applications. ' +
        'Delivered 6+ production projects spanning government portals, restaurant POS systems, and multi-language ' +
        'consultancy platforms. Proficient across the full stack from React and Next.js UIs to Java/Grails and ' +
        'Node.js backends with optimised relational databases.';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...K);
      const summaryLines: string[] = doc.splitTextToSize(summaryText, MW);
      summaryLines.forEach((line: string, idx: number) => {
        const isLast = idx === summaryLines.length - 1;
        if (isLast) {
          doc.text(line, ML, my);
        } else {
          const words = line.trim().split(' ');
          if (words.length > 1) {
            const totalWordWidth = words.reduce((sum: number, w: string) => sum + doc.getTextWidth(w), 0);
            const gap = (MW - totalWordWidth) / (words.length - 1);
            let cx = ML;
            words.forEach((word: string, wi: number) => {
              doc.text(word, cx, my);
              cx += doc.getTextWidth(word) + (wi < words.length - 1 ? gap : 0);
            });
          } else {
            doc.text(line, ML, my);
          }
        }
        my += 4.6;
      });
      my += 5;

      checkMain(50);
      my = sectionHeading('Professional Experience', ML, my, MW);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...K);
      doc.text('Full-Stack Developer', ML, my);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...GR);
      doc.text('2024 - Present', PW - MR, my, { align: 'right' });
      my += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...GR);
      doc.text('NIRC Nepal - Nepal Incubation & Research Center', ML, my);
      my += 6;

      ([
        'Architected and shipped 6+ production applications across diverse industry verticals.',
        'Engineered a real-time restaurant POS reducing order-to-kitchen latency by 70%.',
        'Built a multi-language consultancy platform (8 locales) expanding reach to 10+ countries.',
        'Optimised query paths and frontend bundle sizes, improving performance by ~40%.',
        'Introduced CI/CD pipelines cutting release cycles by 60%.',
        'Developed a government portal digitising 50+ citizen-facing services using Java and Grails.',
      ] as string[]).forEach(a => {
        checkMain(8);
        my = bullet(a, ML, my, MW) + 1;
      });
      my += 5;

      checkMain(30);
      my = sectionHeading('Key Projects', ML, my, MW);

      ([
        {
          title: 'Ambience Infosys - Corporate Website',
          stack: 'Next.js  Node.js  Tailwind CSS  MariaDB',
          desc:  'Full-featured IT company site with service showcase, testimonials, and CMS. Drove 150% increase in client inquiries.',
        },
        {
          title: 'Kansai Japanese Language Institute - LMS',
          stack: 'Next.js  Node.js  MariaDB',
          desc:  'Course management and student-enrollment platform serving 500+ learners with progress analytics.',
        },
        {
          title: 'Rakmina Consultancy - Multi-language Platform',
          stack: 'Next.js  MariaDB  i18n (8 locales)',
          desc:  'Internationalised consultancy portal expanding reach across 10+ countries.',
        },
        {
          title: 'Lucazsoft - Restaurant POS System',
          stack: 'Next.js  Node.js  MariaDB  WebSockets',
          desc:  'End-to-end POS with inventory tracking, live order updates, and financial reporting.',
        },
        {
          title: 'GWP - Government Web Portal',
          stack: 'Java  Grails  JavaScript  HTML  CSS',
          desc:  'Secure, accessible portal consolidating 50+ government services for citizens.',
        },
      ]).forEach(p => {
        checkMain(22);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...K);
        doc.text(p.title, ML, my);
        my += 4.2;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(...GR);
        doc.text(p.stack, ML, my);
        my += 4.5;

        my = bodyText(p.desc, ML, my, MW) + 4;
      });

      // // footer
      // const totalPages = doc.getNumberOfPages();
      // for (let i = 1; i <= totalPages; i++) {
      //   doc.setPage(i);
      //   doc.setDrawColor(...LG);
      //   doc.setLineWidth(0.2);
      //   doc.line(ML, PH - 10, PW - MR, PH - 10);
      //   doc.setFontSize(7.5);
      //   doc.setTextColor(...LG);
      //   doc.text('Ramesh Maharjan  |  Full-Stack Developer', ML, PH - 6);
      //   doc.text(`${i} / ${totalPages}`, PW - MR, PH - 6, { align: 'right' });
      // }

      const date = new Date().toISOString().split('T')[0];
      doc.save(`Ramesh_Maharjan_CV_${date}.pdf`);

      setCvGenerated(true);
      setIsGeneratingCV(false);
      setTimeout(() => setCvGenerated(false), 3000);

    } catch (error) {
      console.error('CV generation error:', error);
      setIsGeneratingCV(false);
    }
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center py-12 sm:py-12 lg:py-16">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl px-4 sm:px-0"
      >
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 mb-6 sm:mb-8 bg-white/5 backdrop-blur shadow-[0_2px_8px_0_rgba(0,0,0,0.3)]"
        >
          <HomeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm text-gray-400">INTRODUCE</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-light mb-6 sm:mb-8 leading-tight"
        >
          Hi, I&apos;m <span className="text-emerald-400 font-bold">Ramesh</span><br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Full-Stack Developer
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mb-8 sm:mb-10 lg:mb-12"
        >
          Full-stack developer at NIRC (Nepal Incubation &amp; Research Center) specializing in React, Node.js, Python Django, Grails, HTML, CSS, and JavaScript.
          Delivering enterprise solutions including government portals, POS systems, and multi-language platforms. 
          1+ year of experience with 6+ major projects deployed and maintained.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={generateCV} 
              disabled={isGeneratingCV}
              className={`relative overflow-hidden font-semibold rounded-full px-6 py-4 sm:px-8 sm:py-6 transition-all duration-300 active:scale-95 text-sm sm:text-base ${
                cvGenerated 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-[0_4px_16px_0_rgba(34,197,94,0.4)]' 
                  : isGeneratingCV 
                    ? 'bg-emerald-300 text-emerald-800 cursor-not-allowed shadow-[0_2px_8px_0_rgba(16,185,129,0.3)]' 
                    : 'bg-emerald-400 hover:bg-emerald-500 text-black shadow-[0_4px_16px_0_rgba(16,185,129,0.4)] hover:shadow-[0_8px_24px_0_rgba(16,185,129,0.5)] hover:-translate-y-0.5'
              }`}
            >
              {isGeneratingCV ? (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <FileText className="w-4 h-4 mr-2 animate-pulse" />
                  Generating CV...
                </>
              ) : cvGenerated ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  CV Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </>
              )}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleViewProjects}
              variant="outline"
              className="text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400 hover:text-white rounded-full px-6 py-4 sm:px-8 sm:py-6 transition-all duration-300 shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] hover:shadow-[0_4px_16px_0_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:scale-95 text-sm sm:text-base"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              View Projects
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
});

export default HeroSection;
