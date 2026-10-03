# Ganesh Vaddepalli: 3D Portfolio

Next.js 14 + Tailwind + Framer Motion + React Three Fiber (frontend) and FastAPI (backend).

## Run locally

```bash
# Terminal 1: backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
python -m pytest            # optional

# Terminal 2: frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

## Notes
- Photo: replace `frontend/public/ganesh-photo.jpg`.
- Contact messages are appended to `backend/data/messages.jsonl`. Set SMTP_* and MAIL_TO in `backend/.env` to also get email.
- Deploy: frontend on Vercel (set NEXT_PUBLIC_API_URL), backend on Cloud Run/Render (set CORS_ORIGINS to your site URL).
- Performance: DPR capped at 1.5, low-poly meshes, one instanced mesh for particles. Fine for an i5/8 GB machine.
