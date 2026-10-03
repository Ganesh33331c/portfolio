import type { Project } from "@/data/projects";

export const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website: string; // honeypot, must stay empty
}

export interface ContactResult {
  ok: boolean;
  detail: string;
}

export async function sendContact(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { detail?: unknown; message?: string };
    if (res.ok) return { ok: true, detail: data.message ?? "Message sent." };
    const detail = typeof data.detail === "string" ? data.detail : "Please check the form and try again.";
    return { ok: false, detail };
  } catch {
    return { ok: false, detail: "Can't reach the server. Check your connection and try again." };
  }
}

/** Optional: backend can override project copy. Falls back to static data on any failure. */
export async function fetchProjects(): Promise<Project[] | null> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Project[];
  } catch {
    return null;
  }
}
