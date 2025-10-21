"use client";

import { useState, useEffect, Suspense, memo, useCallback } from "react";
import emailjs from '@emailjs/browser';
import { Menu, Code, Briefcase, Rocket, Folder, MessageSquare, ExternalLink, Globe, Users, Server, Send, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Card3D from "@/components/Card3D";
import { SiNextdotjs, SiPostgresql, SiNodedotjs, SiTailwindcss, SiLaravel, SiMariadb, SiWordpress, SiReact, SiTypescript, SiMysql, SiPhp, SiJavascript } from "react-icons/si";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormEvent } from "react";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

// Memoized data to prevent regeneration
const skills = [
    { name: "Next.js", icon: <SiNextdotjs className="w-6 h-6" />, level: 95, color: "text-white" },
    { name: "React", icon: <SiReact className="w-6 h-6" />, level: 93, color: "text-cyan-400" },
    { name: "Node.js", icon: <SiNodedotjs className="w-6 h-6" />, level: 90, color: "text-green-500" },
    { name: "TypeScript", icon: <SiTypescript className="w-6 h-6" />, level: 92, color: "text-blue-500" },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="w-6 h-6" />, level: 95, color: "text-cyan-400" },
    { name: "Laravel", icon: <SiLaravel className="w-6 h-6" />, level: 88, color: "text-red-500" },
    { name: "PostgreSQL", icon: <SiPostgresql className="w-6 h-6" />, level: 92, color: "text-blue-400" },
    { name: "MariaDB", icon: <SiMariadb className="w-6 h-6" />, level: 90, color: "text-blue-600" },
    { name: "WordPress", icon: <SiWordpress className="w-6 h-6" />, level: 85, color: "text-blue-500" },
    { name: "PHP", icon: <SiPhp className="w-6 h-6" />, level: 88, color: "text-purple-500" },
    { name: "JavaScript", icon: <SiJavascript className="w-6 h-6" />, level: 94, color: "text-yellow-400" },
    { name: "MySQL", icon: <SiMysql className="w-6 h-6" />, level: 90, color: "text-blue-500" }
];

const projects = [
    { 
        title: "Ambience Infosys", 
        desc: "IT Company Website with modern design and service showcase", 
        tech: "Next.js, Tailwind CSS, Node.js", 
        url: "https://ambienceinfosys.com.np/",
        type: "Corporate Website",
        image: "/Ambience.png"
    },
    { 
        title: "Kansai Japanese Language", 
        desc: "Japanese Language Institute platform with course management", 
        tech: "Laravel, MariaDB, Tailwind CSS", 
        url: "https://kansaijapaneselanguage.com.np/",
        type: "Educational Platform",
        image: "/Kansai.png"
    },
    { 
        title: "Rakmina Consultancy", 
        desc: "Multi-language consultancy platform for abroad opportunities", 
        tech: "Laravel, PostgreSQL, Multi-language", 
        url: "https://rakmina.nirc.com.np/",
        type: "Consultancy System",
        image: "/Rakmina.png"
    },
    { 
        title: "Lucazsoft POS", 
        desc: "Fully-featured Restaurant POS system with inventory management", 
        tech: "Laravel, MariaDB, Node.js", 
        url: "https://lucazsoft.com/login",
        type: "POS System",
        image: "/Lucaz.png"
    },
    { 
        title: "GWP Government Portal", 
        desc: "Government web portal managing all government-related work", 
        tech: "Laravel, PostgreSQL, Tailwind CSS", 
        url: "",
        type: "Government Portal",
        image: "/placeholder.svg"
    },
    { 
        title: "Sam Maharjan Portfolio",
        desc: "Personal portfolio website with modern 3D design", 
        tech: "Next.js, Tailwind CSS, Framer Motion", 
        url: "https://sammaharjan.com.np/home/",
        type: "Portfolio Website",
        image: "/Sam.png"
    }
];

const experiences = [
    { 
        year: "2024 - Present",
        role: "Full-Stack Developer", 
        company: "NIRC Nepal (Incubation And Research Center)", 
        desc: "Developing enterprise applications using React, Node.js, Python Django, Grails, HTML, CSS, and JavaScript. Delivering 6+ major projects including government portals, POS systems, and multi-language platforms."
    }
];

const ContactForm = memo(function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setStatus("Please fill in all required fields");
            return;
        }
        
        setLoading(true);
        setStatus("Sending...");

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                {
                    name: name,
                    email: email,
                    phone: phone || 'Not provided',
                    subject: subject || 'Portfolio Inquiry',
                    message: message
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );

            setStatus("✓ Message sent successfully! I'll get back to you soon.");
            setName("");
            setEmail("");
            setPhone("");
            setSubject("");
            setMessage("");
        } catch (error) {
            setStatus("Failed to send. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [name, email, phone, subject, message]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your Name *" 
                    required
                    className="bg-white/5 border border-white/10 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] !text-white placeholder:text-gray-400" 
                />
            </div>
            <div>
                <Input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    placeholder="Your Email *" 
                    required
                    className="bg-white/5 border border-white/10 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] !text-white placeholder:text-gray-400" 
                />
            </div>
            <div>
                <Input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    type="tel" 
                    placeholder="Your Phone (Optional)" 
                    className="bg-white/5 border border-white/10 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] !text-white placeholder:text-gray-400" 
                />
            </div>
            <div>
                <Input 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="Subject (Optional)" 
                    className="bg-white/5 border border-white/10 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] !text-white placeholder:text-gray-400" 
                />
            </div>
            <div>
                <Textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Your Message *" 
                    rows={5} 
                    required
                    className="bg-white/5 border border-white/10 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.3)] !text-white placeholder:text-gray-400 resize-none" 
                />
            </div>
            {status && <p className="text-sm text-emerald-400">{status}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-black font-semibold rounded-lg py-6 shadow-[0_4px_16px_0_rgba(16,185,129,0.4)] hover:shadow-[0_8px_24px_0_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
});

export default function Home() {
    const [activeSection, setActiveSection] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showMobileHeader, setShowMobileHeader] = useState(false);

    // Optimized scroll handler with throttling
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const sections = ['home', 'about', 'skills', 'experience', 'services', 'projects', 'contact'];
                    const current = sections.find(section => {
                        const element = document.getElementById(section);
                        if (element) {
                            const rect = element.getBoundingClientRect();
                            return rect.top <= 150 && rect.bottom >= 150;
                        }
                        return false;
                    });
                    if (current) setActiveSection(current);
                    setShowMobileHeader(window.scrollY > 600);
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);


    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden relative smooth-scroll">
            <BackgroundAnimation />
            <Suspense fallback={null}>
                <Scene3D />
            </Suspense>

            <div className="relative z-10" itemScope itemType="https://schema.org/Person">
                <Sidebar />
                <Navigation activeSection={activeSection} scrollToSection={scrollToSection} />

                {/* Mobile Header */}
                <header className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800 transition-transform duration-300 ${
                    showMobileHeader ? 'translate-y-0' : '-translate-y-full'
                }`}>
                    <div className="flex items-center justify-between px-6 py-4">
                        <span className="text-xl font-bold text-emerald-400">RAMESH</span>
                        <button onClick={() => setMobileMenuOpen(true)} className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:border-emerald-400 transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </header>
                
                <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activeSection={activeSection} />

                {/* Main Content */}
                <main className="lg:ml-[400px] lg:mr-32 px-6 lg:px-12">
                    <HeroSection />
                    <AboutSection />

                {/* Skills Section */}
                <section id="skills" className="min-h-screen flex flex-col justify-center py-20" aria-label="Technical Skills">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 mb-8 bg-zinc-900/50 backdrop-blur">
                            <Code className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-400">SKILLS</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-light mb-16">
                            Technical <span className="text-emerald-400">Expertise</span>
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {skills.map((skill, i) => (
                                <Card3D key={i}>
                                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_12px_48px_0_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 flex items-center justify-center ${skill.color} shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]`}>
                                                {skill.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                                                <p className="text-sm text-gray-300">{skill.level}% Proficiency</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-zinc-800/50 rounded-full h-3 overflow-hidden shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)]">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className="bg-gradient-to-r from-emerald-400 to-blue-400 h-3 rounded-full shadow-[0_2px_8px_0_rgba(16,185,129,0.5)]"
                                            />
                                        </div>
                                    </Card>
                                </Card3D>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Experience Section */}
                <section id="experience" className="min-h-screen flex flex-col justify-center py-20" aria-label="Work Experience">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 mb-8 bg-zinc-900/50 backdrop-blur">
                            <Briefcase className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-400">EXPERIENCE</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-light mb-16">
                            Work & <span className="text-emerald-400">Education</span>
                        </h2>

                        <div className="space-y-10">
                            <Card3D>
                                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_12px_48px_0_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="px-4 py-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-400/30 rounded-full text-blue-400 font-semibold min-w-[150px] text-center shadow-[0_4px_16px_0_rgba(59,130,246,0.2)]">2020 - 2025</div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold mb-2 text-white">Bachelor in Computer Application</h3>
                                            <p className="text-gray-300 mb-2">Tribhuvan University</p>
                                            <p className="text-gray-400">Completed comprehensive computer science education with focus on software development, database management, and web technologies.</p>
                                        </div>
                                    </div>
                                </Card>
                            </Card3D>
                            {experiences.map((exp, i) => (
                                <Card3D key={i}>
                                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_12px_48px_0_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-1">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            <div className="px-4 py-2 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 border border-emerald-400/30 rounded-full text-emerald-400 font-semibold min-w-[150px] text-center shadow-[0_4px_16px_0_rgba(16,185,129,0.2)]">{exp.year}</div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-semibold mb-2 text-white">{exp.role}</h3>
                                                <p className="text-gray-300 mb-2">{exp.company}</p>
                                                <p className="text-gray-400">{exp.desc}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </Card3D>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Services Section */}
                <section id="services" className="min-h-screen flex flex-col justify-center py-20" aria-label="Services Offered">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 mb-8 bg-zinc-900/50 backdrop-blur">
                            <Rocket className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-400">SERVICES</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-light mb-16">
                            What I <span className="text-emerald-400">Offer</span>
                        </h2>

                        <div className="grid md:grid-cols-3 gap-10">
                            <Card3D>
                                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 h-full rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_12px_48px_0_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-1">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-[0_8px_24px_0_rgba(16,185,129,0.4)]">
                                        <Globe className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4 text-white">Web Development</h3>
                                    <p className="text-gray-300 mb-4">Full-stack web applications using Next.js, React, Laravel, and modern technologies</p>
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li>• Responsive Design</li>
                                        <li>• API Integration</li>
                                        <li>• Database Design</li>
                                    </ul>
                                </Card>
                            </Card3D>

                            <Card3D>
                                <Card className="bg-gradient-to-br from-zinc-950 to-zinc-900 backdrop-blur-xl border-2 border-zinc-700/50 p-8 h-full shadow-2xl shadow-zinc-900/50 hover:border-blue-500/50 transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-[0_8px_24px_0_rgba(59,130,246,0.4)]">
                                        <Server className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4 text-white">Backend Systems</h3>
                                    <p className="text-gray-300 mb-4">Scalable backend solutions with Node.js, Laravel, and database optimization</p>
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li>• RESTful APIs</li>
                                        <li>• Authentication</li>
                                        <li>• Performance Tuning</li>
                                    </ul>
                                </Card>
                            </Card3D>

                            <Card3D>
                                <Card className="bg-gradient-to-br from-zinc-950 to-zinc-900 backdrop-blur-xl border-2 border-zinc-700/50 p-8 h-full shadow-2xl shadow-zinc-900/50 hover:border-teal-500/50 transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-6 shadow-[0_8px_24px_0_rgba(20,184,166,0.4)]">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4 text-white">UI/UX Design</h3>
                                    <p className="text-gray-300 mb-4">Creating intuitive and visually appealing user interfaces with modern design principles</p>
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li>• Responsive Design</li>
                                        <li>• User Experience</li>
                                        <li>• Prototyping</li>
                                    </ul>
                                </Card>
                            </Card3D>
                        </div>

                        <div className="mt-12 grid md:grid-cols-4 gap-10">
                            <Card3D>
                                <Card className="bg-white/5 backdrop-blur-xl border border-emerald-400/30 p-6 text-center rounded-2xl shadow-[0_8px_32px_0_rgba(16,185,129,0.2)] hover:shadow-[0_12px_48px_0_rgba(16,185,129,0.4)] transition-all duration-300">
                                    <div className="text-4xl font-bold text-emerald-400 mb-2">6+</div>
                                    <p className="text-gray-300">Major Projects</p>
                                </Card>
                            </Card3D>
                            <Card3D>
                                <Card className="bg-white/5 backdrop-blur-xl border border-blue-400/30 p-6 text-center rounded-2xl shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_12px_48px_0_rgba(59,130,246,0.4)] transition-all duration-300">
                                    <div className="text-4xl font-bold text-blue-400 mb-2">1+</div>
                                    <p className="text-gray-300">Year Experience</p>
                                </Card>
                            </Card3D>
                            <Card3D>
                                <Card className="bg-white/5 backdrop-blur-xl border border-purple-400/30 p-6 text-center rounded-2xl shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] hover:shadow-[0_12px_48px_0_rgba(168,85,247,0.4)] transition-all duration-300">
                                    <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
                                    <p className="text-gray-300">Client Satisfaction</p>
                                </Card>
                            </Card3D>
                            <Card3D>
                                <Card className="bg-white/5 backdrop-blur-xl border border-pink-400/30 p-6 text-center rounded-2xl shadow-[0_8px_32px_0_rgba(236,72,153,0.2)] hover:shadow-[0_12px_48px_0_rgba(236,72,153,0.4)] transition-all duration-300">
                                    <div className="text-4xl font-bold text-pink-400 mb-2">12+</div>
                                    <p className="text-gray-300">Technologies</p>
                                </Card>
                            </Card3D>
                        </div>
                    </motion.div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="min-h-screen flex flex-col justify-center py-20" aria-label="Portfolio Projects">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 mb-8 bg-zinc-900/50 backdrop-blur">
                            <Folder className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-400">PROJECTS</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-light mb-16">
                            Featured <span className="text-emerald-400">Work</span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-16">
                            {projects.map((project, i) => (
                                <Card3D key={i}>
                                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden h-full rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_12px_48px_0_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-1 group">
                                        <div className="relative w-full h-48 overflow-hidden bg-zinc-800">
                                            <img 
                                                src={project.image} 
                                                alt={`${project.title} - ${project.type} screenshot`}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-emerald-400/30 flex items-center justify-center hover:bg-emerald-400/20 transition-all">
                                                        <ExternalLink className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <div className="mb-3">
                                                <span className="px-3 py-1 bg-emerald-400/10 border border-emerald-400/30 rounded-full text-xs text-emerald-400 shadow-[0_2px_8px_0_rgba(16,185,129,0.2)]">
                                                    {project.type}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-semibold mb-3 text-white">{project.title}</h3>
                                            <p className="text-gray-300 mb-4">{project.desc}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.split(", ").map((tech, j) => (
                                                    <span key={j} className="px-3 py-1 bg-zinc-800/50 border border-zinc-600/50 rounded-full text-xs text-gray-300 shadow-[0_2px_8px_0_rgba(0,0,0,0.3)]">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </Card3D>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="min-h-screen flex flex-col justify-center py-20" aria-label="Contact Information">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 mb-8 bg-zinc-900/50 backdrop-blur">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-400">CONTACT</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-light mb-16">
                            Let's <span className="text-emerald-400">Connect</span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-16">
                            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                                <ContactForm />
                            </Card>

                            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 h-full rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                                    <h3 className="text-emerald-400 text-2xl font-semibold mb-6">Contact Info</h3>
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_4px_16px_0_rgba(16,185,129,0.4)]">
                                                <Mail className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Email</p>
                                                <p className="text-white font-medium">mhrjan0@gmail.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[0_4px_16px_0_rgba(59,130,246,0.4)]">
                                                <MapPin className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Location</p>
                                                <p className="text-white font-medium">Kathmandu, Nepal</p>
                                            </div>
                                        </div>
                                    </div>
                            </Card>
                        </div>
                    </motion.div>
                </section>
            </main>
            </div>
        </div>
    );
}
