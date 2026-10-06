from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    subject: str = Field(min_length=3, max_length=120)
    message: str = Field(min_length=10, max_length=2000)
    website: str = Field(default="", max_length=200)  # honeypot

    @field_validator("name", "subject", "message")
    @classmethod
    def strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("must not be blank")
        return v


class ContactOut(BaseModel):
    ok: bool = True
    message: str


class ProjectOut(BaseModel):
    id: Literal["code-editor", "sentiment", "nexus", "exploit-explainer", "careerweave"]
    category: Literal["academic", "personal"]
    title: str
    description: str
    stack: list[str]
    github: str | None = None
