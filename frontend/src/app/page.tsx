import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectShowcase from "@/components/ProjectShowcase";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <ProjectShowcase />
        <Contact />
      </main>
      <footer className="py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Ganesh Vaddepalli
      </footer>
    </>
  );
}
