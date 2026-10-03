from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status

from app.config import Settings, get_settings
from app.schemas import ContactIn, ContactOut
from app.services import rate_limited, send_email, store_message

router = APIRouter(prefix="/api", tags=["contact"])


@router.post("/contact", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
def submit_contact(
    payload: ContactIn,
    request: Request,
    background: BackgroundTasks,
    settings: Settings = Depends(get_settings),
) -> ContactOut:
    ip = request.client.host if request.client else "unknown"

    if payload.website:  # honeypot tripped: pretend success, store nothing
        return ContactOut(message="Message sent. I'll reply soon.")

    if rate_limited(ip, settings.rate_limit_per_hour):
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Too many messages. Try again in an hour.")

    store_message(settings, payload, ip)
    background.add_task(send_email, settings, payload)
    return ContactOut(message="Message sent. I'll reply soon.")
