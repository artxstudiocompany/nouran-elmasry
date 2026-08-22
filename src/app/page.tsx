"use client";

import { I18nProvider } from "@/i18n/provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Specialties from "@/components/sections/Specialties";
import Projects from "@/components/sections/Projects";
import EngineeringViz from "@/components/sections/EngineeringViz";
import Experience from "@/components/sections/Experience";
import CvSection from "@/components/sections/CvSection";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

function PortfolioContent() {
  return (
    <>
      <div className="grain-overlay" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Specialties />
        <Projects />
        <Experience />
        <CvSection />
        <Skills />
        <EngineeringViz />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <PortfolioContent />
    </I18nProvider>
  );
}
