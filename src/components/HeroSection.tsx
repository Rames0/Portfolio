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
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const doc = new jsPDF();
      const primaryColor = [16, 185, 129]; // Emerald color
      
      // Page dimensions and margins
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Helper function to add text with proper wrapping
      const addText = (text: string, x: number, y: number, options: { align?: 'left' | 'center' | 'right' } = {}) => {
        const lines = doc.splitTextToSize(text, contentWidth - (x - margin));
        doc.text(lines, x, y, options);
        return y + (lines.length * 5);
      };
      
      // Helper function to check if we need a new page
      const checkNewPage = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - margin) {
          doc.addPage();
          return margin;
        }
        return yPos;
      };
      
      // Professional header
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Main title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('RAMESH MAHARJAN', pageWidth / 2, 18, { align: 'center' });
      
      // Professional subtitle
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Full-Stack Developer', pageWidth / 2, 26, { align: 'center' });
      
      // Contact information
      doc.setFontSize(9);
      doc.text('Email: mhrjan0@gmail.com | Location: Kathmandu, Nepal', pageWidth / 2, 34, { align: 'center' });
      
      // Start content after header
      let yPos = 50;
      
      // Professional Summary Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('PROFESSIONAL SUMMARY', margin, yPos);
      
      // Decorative line
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
      
      yPos += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summary = 'Full-Stack Developer with 1 year of expertise in modern web technologies including React, Node.js, Python Django, Grails, HTML, CSS, and JavaScript. Delivering enterprise solutions including government portals, POS systems, and multi-language platforms.';
      yPos = addText(summary, margin, yPos) + 5;
      
      // Technical Skills Section
      yPos = checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('TECHNICAL EXPERTISE', margin, yPos);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
      
      yPos += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const skillCategories = [
        { title: 'Frontend Development', skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'JavaScript'], level: 'Expert' },
        { title: 'Backend Development', skills: ['Node.js', 'Laravel', 'PHP', 'RESTful APIs', 'GraphQL'], level: 'Advanced' },
        { title: 'Database Management', skills: ['PostgreSQL', 'MariaDB', 'MySQL', 'Database Design'], level: 'Expert' },
        { title: 'DevOps & Tools', skills: ['Git', 'Docker', 'AWS', 'CI/CD', 'Linux'], level: 'Intermediate' }
      ];
      
      skillCategories.forEach(cat => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${cat.title} (${cat.level}):`, margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(cat.skills.join(' • '), margin + 5, yPos + 4);
        yPos += 8;
      });
      
      // Professional Experience Section
      yPos = checkNewPage(40);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('PROFESSIONAL EXPERIENCE', margin, yPos);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
      
      yPos += 8;
      const experiences = [
        { 
          year: "2024 - Present", 
          role: "Full-Stack Developer", 
          company: "NIRC Nepal (Incubation And Research Company)", 
          desc: "Developing enterprise applications using React, Node.js, Python Django, Grails, HTML, CSS, and JavaScript. Delivering 6+ major projects including government portals, POS systems, and multi-language platforms.",
          achievements: [
            "Delivered 6+ major projects with high quality standards",
            "Built scalable POS systems for restaurant management",
            "Developed multi-language platforms supporting 5+ languages",
            "Improved application performance by 40% through optimization",
            "Implemented CI/CD pipelines reducing deployment time by 60%",
            "Created reusable component libraries and design systems"
          ]
        }
      ];
      
      experiences.forEach((exp) => {
        yPos = checkNewPage(25);
        
        // Role and company
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.role, margin, yPos);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(exp.company, margin, yPos + 4);
        doc.text(exp.year, pageWidth - margin, yPos + 4, { align: 'right' });
        
        // Description
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        yPos = addText(exp.desc, margin, yPos + 8) + 2;
        
        // Key achievements
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Key Achievements:', margin, yPos);
        
        exp.achievements.forEach((achievement) => {
          doc.text(`• ${achievement}`, margin + 5, yPos + 4);
          yPos += 4;
        });
        
        yPos += 5;
      });
      
      // Projects Section
      doc.addPage();
      yPos = margin;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('KEY PROJECTS', margin, yPos);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
      
      yPos += 8;
      const projects = [
        { 
          title: "Ambience Infosys Corporate Website", 
          desc: "Modern IT company website with service showcase, client testimonials, and contact management system.",
          tech: "Next.js, Tailwind CSS, Node.js, PostgreSQL",
          impact: "Increased client inquiries by 150%"
        },
        { 
          title: "Kansai Japanese Language Institute", 
          desc: "Educational platform with course management, student enrollment, and progress tracking system.",
          tech: "Laravel, MariaDB, Tailwind CSS, JavaScript",
          impact: "Streamlined course management for 500+ students"
        },
        { 
          title: "Rakmina Consultancy Multi-language Platform", 
          desc: "Comprehensive consultancy platform supporting multiple languages for international opportunities.",
          tech: "Laravel, PostgreSQL, Multi-language Support",
          impact: "Expanded reach to 10+ countries"
        },
        { 
          title: "Lucazsoft Restaurant POS System", 
          desc: "Complete restaurant management system with inventory, sales tracking, and reporting features.",
          tech: "Laravel, MariaDB, Node.js, Real-time Updates",
          impact: "Reduced order processing time by 70%"
        },
        { 
          title: "GWP Government Portal", 
          desc: "Comprehensive government web portal managing all government-related services and information.",
          tech: "Laravel, PostgreSQL, Tailwind CSS, Security",
          impact: "Digitized 50+ government services"
        }
      ];
      
      projects.forEach((project) => {
        yPos = checkNewPage(20);
        
        // Project title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(project.title, margin, yPos);
        
        // Impact
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`Impact: ${project.impact}`, pageWidth - margin, yPos, { align: 'right' });
        
        // Description
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        yPos = addText(project.desc, margin, yPos + 4) + 2;
        
        // Technologies
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Technologies: ${project.tech}`, margin, yPos);
        
        yPos += 8;
      });
      
      // Education & Certifications
      yPos = checkNewPage(20);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('EDUCATION & CERTIFICATIONS', margin, yPos);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const education = [
        "Bachelor of Computer Applications (BCA) - Ongoing",
        "Advanced Web Development Certification",
        "Database Management Systems Certification",
        "Agile Project Management Certification"
      ];
      
      education.forEach(edu => {
        doc.text(`• ${edu}`, margin, yPos);
        yPos += 5;
      });
      
      // Footer with professional details
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        
        // Footer text
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(`Ramesh Maharjan - Full-Stack Developer`, margin, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
      
      // Save with professional filename
      const timestamp = new Date().toISOString().split('T')[0];
      doc.save(`Ramesh_Maharjan_CV_${timestamp}.pdf`);
      
      setCvGenerated(true);
      setIsGeneratingCV(false);
      
      // Reset success state after 3 seconds
      setTimeout(() => setCvGenerated(false), 3000);
      
    } catch (error) {
      console.error('Error generating CV:', error);
      setIsGeneratingCV(false);
      // You could add a toast notification here
    }
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center py-20">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl"
      >
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 mb-8 bg-white/5 backdrop-blur shadow-[0_2px_8px_0_rgba(0,0,0,0.3)]"
        >
          <HomeIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-gray-400">INTRODUCE</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight"
        >
          Say Hi from <span className="text-emerald-400 font-bold">Ramesh</span>,<br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Full-Stack Developer
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-gray-400 text-lg leading-relaxed max-w-2xl mb-12"
        >
          Full-stack developer at NIRC Nepal specializing in React, Node.js, Python Django, Grails, HTML, CSS, and JavaScript. 
          Delivering enterprise solutions including government portals, POS systems, and multi-language platforms. 
          1 year of experience with 6+ major projects deployed and maintained.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={generateCV} 
              disabled={isGeneratingCV}
              className={`relative overflow-hidden font-semibold rounded-full px-8 py-6 transition-all duration-300 active:scale-95 ${
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
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={handleViewProjects} variant="outline" className="text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400 hover:text-white rounded-full px-8 py-6 transition-all duration-300 shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] hover:shadow-[0_4px_16px_0_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:scale-95">
              <Eye className="w-4 h-4 mr-2" />
              View Projects
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
});

export default HeroSection;
