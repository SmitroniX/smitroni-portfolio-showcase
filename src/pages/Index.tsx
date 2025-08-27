import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Games from "@/components/sections/Games";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import ParticleField from "@/components/interactive/ParticleField";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <ParticleField />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Games />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
