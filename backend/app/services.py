import json
import logging
import smtplib
import time
from collections import defaultdict, deque
from datetime import datetime, timezone
from email.message import EmailMessage

import httpx

from app.config import Settings
from app.schemas import ContactIn

log = logging.getLogger("portfolio.contact")

_hits: dict[str, deque[float]] = defaultdict(deque)


def rate_limited(ip: str, limit: int, window_s: int = 3600) -> bool:
    """Sliding-window limiter (in-memory; use Redis if you scale past one worker)."""
    now = time.monotonic()
    q = _hits[ip]
    while q and now - q[0] > window_s:
        q.popleft()
    if len(q) >= limit:
        return True
    q.append(now)
    return False


def store_message(settings: Settings, msg: ContactIn, ip: str) -> None:
    """Always log to stdout (hosts keep logs); also append to disk when the disk is writable.

    Free hosts such as Render have an ephemeral disk, so the log line and the email are
    the durable copies there.
    """
    record = {
        "at": datetime.now(timezone.utc).isoformat(),
        "ip": ip,
        "name": msg.name,
        "email": str(msg.email),
        "subject": msg.subject,
        "message": msg.message,
    }
    log.info("contact_message %s", json.dumps(record, ensure_ascii=False))
    try:
        settings.messages_file.parent.mkdir(parents=True, exist_ok=True)
        with settings.messages_file.open("a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except OSError:
        log.warning("could not write messages file", exc_info=True)


def _send_brevo(settings: Settings, msg: ContactIn) -> None:
    resp = httpx.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={"api-key": settings.brevo_api_key, "accept": "application/json"},
        json={
            "sender": {"name": "Portfolio", "email": settings.mail_from},
            "to": [{"email": settings.mail_to}],
            "replyTo": {"email": str(msg.email), "name": msg.name},
            "subject": f"[Portfolio] {msg.subject} (from {msg.name})",
            "textContent": f"From: {msg.name} <{msg.email}>\nSubject: {msg.subject}\n\n{msg.message}",
        },
        timeout=15,
    )
    resp.raise_for_status()


def _send_smtp(settings: Settings, msg: ContactIn) -> None:
    mail = EmailMessage()
    mail["Subject"] = f"[Portfolio] {msg.subject} (from {msg.name})"
    mail["From"] = settings.smtp_user or settings.mail_to
    mail["To"] = settings.mail_to
    mail["Reply-To"] = str(msg.email)
    mail.set_content(f"From: {msg.name} <{msg.email}>\nSubject: {msg.subject}\n\n{msg.message}")
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
        smtp.starttls()
        if settings.smtp_user:
            smtp.login(settings.smtp_user, settings.smtp_password)
        smtp.send_message(mail)


def send_email(settings: Settings, msg: ContactIn) -> None:
    """Background task. Prefers the Brevo HTTPS API, falls back to SMTP; never raises."""
    try:
        if settings.brevo_api_key and settings.mail_from and settings.mail_to:
            _send_brevo(settings, msg)
        elif settings.smtp_host and settings.mail_to:
            _send_smtp(settings, msg)
    except Exception:  # noqa: BLE001 - message is already in the logs
        log.exception("email delivery failed")
