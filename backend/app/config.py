from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    cors_origins: str = "http://localhost:3000"
    messages_file: Path = Path("data/messages.jsonl")

    # HTTPS email (works on free hosts that block SMTP ports)
    brevo_api_key: str = ""
    mail_from: str = ""  # a sender you verified in Brevo

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    mail_to: str = ""

    rate_limit_per_hour: int = 5

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
