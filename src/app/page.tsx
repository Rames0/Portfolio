import { Navigation } from "@/components/Navigation";
import { WelcomeMotion } from "@/components/WelcomeMotion";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { AboutInfo, Capabilities, Experience } from "@/components/AboutInfo";
import { ArchitectureLab } from "@/components/ArchitectureLab";
import { Contact, Footer } from "@/components/Contact";

export const metadata = {
  title: "Ramesh Maharjan | Full-Stack Engineer",
  description: "I build production web systems across frontend, backend, data, and real-time workflows.",
};

export default function Home() {
  return (
    <div className="site-shell bg-[var(--bg-primary)]">
      <WelcomeMotion />
      <Navigation />
      
      <main>
        <Hero />
        <SelectedWork />
        <AboutInfo />
        <Capabilities />
        <Experience />
        <ArchitectureLab />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}
