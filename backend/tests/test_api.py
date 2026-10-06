from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.config import Settings, get_settings
from app.main import app
from app import services

VALID = {"name": "Asha", "email": "asha@example.com", "subject": "Python role", "message": "Hello Ganesh, let's talk about a role."}


@pytest.fixture()
def client(tmp_path: Path):
    services._hits.clear()
    app.dependency_overrides[get_settings] = lambda: Settings(messages_file=tmp_path / "m.jsonl")
    yield TestClient(app), tmp_path / "m.jsonl"
    app.dependency_overrides.clear()


def test_projects(client):
    c, _ = client
    r = c.get("/api/projects")
    assert r.status_code == 200 and len(r.json()) == 5


def test_contact_ok_and_stored(client):
    c, f = client
    r = c.post("/api/contact", json=VALID)
    assert r.status_code == 201 and r.json()["ok"] is True
    assert "Asha" in f.read_text()


def test_contact_validation(client):
    c, _ = client
    assert c.post("/api/contact", json={**VALID, "email": "nope"}).status_code == 422


def test_honeypot_stores_nothing(client):
    c, f = client
    assert c.post("/api/contact", json={**VALID, "website": "http://spam"}).status_code == 201
    assert not f.exists()


def test_rate_limit(client):
    c, _ = client
    codes = [c.post("/api/contact", json=VALID).status_code for _ in range(6)]
    assert codes[-1] == 429


def test_subject_required(client):
    c, _ = client
    body = {k: v for k, v in VALID.items() if k != "subject"}
    assert c.post("/api/contact", json=body).status_code == 422
