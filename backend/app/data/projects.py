from app.schemas import ProjectOut

PROJECTS: list[ProjectOut] = [
    ProjectOut(
        id="code-editor",
        category="academic",
        title="Real Time Collaborative Code Editor",
        description="Engineered a high-performance web-based code editor enabling synchronous, real-time developer collaboration.",
        stack=["React", "Node.js", "WebSockets", "Monaco Editor", "JavaScript"],
    ),
    ProjectOut(
        id="sentiment",
        category="academic",
        title="Data-Driven Sentiment Analysis & Insight Generation",
        description="Developed an end-to-end NLP pipeline with a responsive UI to extract actionable insights from textual data.",
        stack=["Python", "NLTK", "Flask", "MySQL", "Streamlit"],
    ),
    ProjectOut(
        id="nexus",
        category="personal",
        title="Nexus: Proactive DevSecOps AI Agent",
        description="Built an intelligent, proactive DevSecOps AI agent designed to automate security workflows and analyze vulnerabilities.",
        stack=["Python", "FastAPI", "React.js", "PostgreSQL", "Docker"],
        github="https://github.com/Ganesh33331c/Nexus-Proactive_DevSecOps_AI_Agent",
    ),
    ProjectOut(
        id="exploit-explainer",
        category="personal",
        title="Exploit Payload Explainer",
        description="Designed an AI-powered security tool utilizing multi-agent architecture to deconstruct, analyze, and explain complex exploit payloads.",
        stack=["Multi-Agent AI", "Python", "Cloud Run", "Gemini"],
        github="https://github.com/Ganesh33331c/Exploit_Payload_Explainer_Agent",
    ),
    ProjectOut(
        id="careerweave",
        category="personal",
        title="CareerWeave",
        description="Developed an advanced Generative AI application leveraging agentic workflows to streamline career development.",
        stack=["Multi-Agent AI", "Python", "Django REST Framework", "GCP"],
        github="https://github.com/Ganesh33331c/CareerWeave",
    ),
]
