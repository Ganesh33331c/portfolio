export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  url: string;
  accent: "cyan" | "purple";
}

export const CERTIFICATES: Certificate[] = [
  {
    title: "Python Certificate",
    issuer: "KodeKloud",
    date: "Apr 2026",
    url: "https://learn.kodekloud.com/certificate/44e94205-3774-4df2-8c8a-046d080e9a4b",
    accent: "cyan",
  },
  {
    title: "Google Cloud Gen AI Academy APAC 2026, Cohort 1",
    issuer: "Google Cloud",
    date: "Aug 2026",
    url: "https://certificate.hack2skill.com/verify/2026H2S04GCGENAIAPACC1-P01910",
    accent: "purple",
  },
  {
    title: "Prompt Engineering Certificate",
    issuer: "KodeKloud",
    date: "May 2026",
    url: "https://learn.kodekloud.com/certificate/ae9c53e7-e2d6-4dc7-ad8b-c50272cacc02",
    accent: "cyan",
  },
  {
    title: "Junior Cyber Security Certificate",
    issuer: "Cisco Networking Academy",
    date: "Mar 2026",
    url: "https://www.credly.com/earner/earned/badge/1d822f22-d261-4cf6-886e-dd59795475f9",
    accent: "purple",
  },
];
