from fastapi import APIRouter, HTTPException, status

from app.data.projects import PROJECTS
from app.schemas import ProjectOut

router = APIRouter(prefix="/api", tags=["projects"])


@router.get("/projects", response_model=list[ProjectOut])
def list_projects() -> list[ProjectOut]:
    return PROJECTS


@router.get("/projects/{project_id}", response_model=ProjectOut)
def get_project(project_id: str) -> ProjectOut:
    for p in PROJECTS:
        if p.id == project_id:
            return p
    raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
