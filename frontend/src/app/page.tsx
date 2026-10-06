import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ResumeBanner from "@/components/ResumeBanner";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import ProjectShowcase from "@/components/ProjectShowcase";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ResumeBanner />
        <Education />
        <Skills />
        <ProjectShowcase />
        <Certificates />
        <Contact />
      </main>
      <footer className="py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Ganesh Vaddepalli
      </footer>
    </>
  );
}
