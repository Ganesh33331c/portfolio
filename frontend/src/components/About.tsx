import Reveal from "./Reveal";

const PARAGRAPHS: string[] = [
  "I am a Computer Science engineering graduate and a Python Full-Stack Developer driven by the challenge of building applications that are not only highly functional but also intelligent and resilient. My foundation is built on Python, FastAPI, and React, allowing me to architect end-to-end web applications—such as live, real-time collaborative code editors and data-driven analysis systems.",
  "What truly excites me about the future of software is Agentic AI. I specialize in designing multi-agent AI ecosystems using LangChain, LangGraph, and advanced LLM APIs. During the Google Cloud Gen AI Academy Hackathon, I developed CareerWeave, a complex multi-agent platform, and I am continuously exploring ways to make autonomous AI practical and impactful.",
  "In today's landscape, deploying code without security is a liability. My enthusiasm for cybersecurity heavily influences my development approach. I actively blend DevSecOps principles, vulnerability assessment, and penetration testing into my workflow. This intersection inspired Nexus, an autonomous DevSecOps AI system I built to scan codebases and generate security patches.",
  "Currently seeking new opportunities in the Greater Hyderabad area and remote environments, I am eager to bring my unique blend of full-stack engineering, artificial intelligence, and security operations to a forward-thinking team.",
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-5 py-24">
      <Reveal><h2 className="text-4xl font-bold">About <span className="text-gradient">Me</span></h2></Reveal>
      <div className="mt-8 space-y-6">
        {PARAGRAPHS.map((p, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <p className="text-lg leading-8 text-slate-300">{p}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
